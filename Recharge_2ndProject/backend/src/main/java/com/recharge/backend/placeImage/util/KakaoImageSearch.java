package com.recharge.backend.placeImage.util;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class KakaoImageSearch {

    @Value("${kakao.rest-api-key}")
    private String kakaoKey;

    public String searchImage(String query) {
        try {
            String url = "https://dapi.kakao.com/v2/search/image?query=" + query;

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "KakaoAK " + kakaoKey);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            RestTemplate rest = new RestTemplate();
            ResponseEntity<String> response = rest.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            JSONObject json = new JSONObject(response.getBody());

            // 결과 없으면 null return
            if (!json.has("documents") || json.getJSONArray("documents").isEmpty()) {
                return null;
            }

            // thumbnail_url 사용 (중요!)
            return json.getJSONArray("documents")
                    .getJSONObject(0)
                    .getString("thumbnail_url");

        } catch (Exception e) {
            System.out.println("카카오 이미지 검색 오류: " + e.getMessage());
            return null;
        }
    }
}
