package com.recharge.backend.fortune.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.recharge.backend.fortune.vo.FortuneRequestVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.beans.factory.annotation.Qualifier;

import java.util.HashMap;
import java.util.Map;

@Service
public class FortuneService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Autowired
    public FortuneService(
            @Qualifier("fortuneWebClient") WebClient webClient,
            ObjectMapper objectMapper
    ) {
        this.webClient = webClient;
        this.objectMapper = objectMapper;
    }

    /**
     * Gemini API 호출 로직
     */
    public String getFortune(FortuneRequestVO requestVO) {
        String prompt = createPrompt(requestVO);

        // Gemini API request body format
        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> part = new HashMap<>();
        part.put("text", prompt);

        Map<String, Object> content = new HashMap<>();
        content.put("parts", new Object[]{part});

        requestBody.put("contents", new Object[]{content});

        try {
            String jsonResponse = webClient.post()
                    .uri(geminiApiUrl + "?key=" + geminiApiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            return parseGeminiResponse(jsonResponse);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Gemini API 호출 실패: " + e.getMessage());
        }
    }

    /**
     * Gemini API 응답 파싱
     */
    private String parseGeminiResponse(String jsonResponse) {
        try {
            JsonNode root = objectMapper.readTree(jsonResponse);

            JsonNode textNode = root
                    .path("candidates").get(0)
                    .path("content").path("parts").get(0)
                    .path("text");

            if (textNode.isMissingNode()) {
                throw new RuntimeException("API 응답에서 'text' 필드가 없습니다.");
            }

            return textNode.asText();

        } catch (Exception e) {
            throw new RuntimeException("Gemini 응답 파싱 실패: " + e.getMessage());
        }
    }

    /**
     * 프롬프트 생성
     */
    private String createPrompt(FortuneRequestVO vo) {

        String gender = vo.getGender().equals("male") ? "남성" : "여성";

        String calendar = switch (vo.getCalendarType()) {
            case "lunar" -> "음력(평달)";
            case "lunar_leap" -> "음력(윤달)";
            default -> "양력";
        };

        String time = vo.getBirthTime().equals("unknown") ? "모름" : vo.getBirthTime() + " 경";

        return String.format(
                "당신은 한국의 유명한 역술가입니다. 아래 정보를 바탕으로 오늘의 운세를 상세히 작성해주세요.\n" +
                        "호칭은 '당신'으로 통일합니다.\n" +
                        "- 성별: %s\n" +
                        "- 생년월일: %s (%s)\n" +
                        "- 태어난 시간: %s\n\n" +
                        "오늘의 총운, 금전운, 연애운, 건강운을 500자 내외로 작성해주세요.",
                gender, vo.getBirthdate(), calendar, time
        );
    }
}
