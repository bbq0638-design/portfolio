package com.recharge.backend.music.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.recharge.backend.music.dao.MusicDAO;
import com.recharge.backend.music.vo.MusicVO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MusicServiceImpl implements MusicService {

    private final MusicDAO musicDAO;
    private final WebClient itunesWebClient; // Bean은 Config에서 주입
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${itunes.country:KR}")
    private String country;

    @Value("${itunes.limit:50}")
    private int defaultLimit;

    private static String toMinSec(long millis) {
        if (millis <= 0) return "00:00";
        long totalSec = millis / 1000;
        long m = totalSec / 60;
        long s = totalSec % 60;
        return String.format("%02d:%02d", m, s);
    }

    @Override
    public List<MusicVO> searchItunes(String term, int limit) {
        try {
            String json = itunesWebClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/search")
                            .queryParam("term", term)
                            .queryParam("country", country)
                            .queryParam("media", "music")
                            .queryParam("limit", limit > 0 ? limit : defaultLimit)
                            .build())
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode results = objectMapper.readTree(json).path("results");
            List<MusicVO> list = new ArrayList<>();

            for (JsonNode node : results) {
                long trackId = node.path("trackId").asLong(0);
                if (trackId == 0) continue;

                long ms = node.path("trackTimeMillis").asLong(0);

                MusicVO vo = new MusicVO();
                vo.setMusicId(trackId);
                vo.setMusicTitle(node.path("trackName").asText(""));
                vo.setMusicSinger(node.path("artistName").asText(""));
                vo.setMusicImagePath(node.path("artworkUrl100").asText(""));
                vo.setMusicPreviewUrl(node.path("previewUrl").asText(null));
                vo.setMusicPlaytimeMs(ms);
                vo.setMusicPlaytime(toMinSec(ms));

                list.add(vo);
            }
            return list;
        } catch (Exception e) {
            // TODO: 적절한 로깅으로 교체하세요
            e.printStackTrace();
            return List.of();
        }
    }

    @Transactional
    @Override
    public int saveAll(List<MusicVO> list, String actorId) {
        if (list == null || list.isEmpty()) return 0;
        // actorId는 현재 매퍼에서 'system'으로 넣고 있으니 필요 시 매퍼에 파라미터로 넘겨 바꾸세요.
        return musicDAO.upsertBulk(list);
    }

    @Override
    public List<MusicVO> searchFromDb(String keyword) {
        return musicDAO.searchFromDb(keyword);
    }

    @Override
    public List<MusicVO> fetchTopSongsKr() {
        try {
            String rssUrl = "https://rss.marketingtools.apple.com/api/v2/kr/music/most-played/50/songs.json";

            String json = WebClient.create()
                    .get()
                    .uri(rssUrl)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            if (json == null || json.isBlank()) {
                throw new IllegalStateException("Apple RSS API returned no data (null or empty)");
            }

            JsonNode feed = objectMapper.readTree(json).path("feed").path("results");
            List<MusicVO> list = new ArrayList<>();

            for (JsonNode node : feed) {
                long musicId = node.path("id").asLong();
                String title = node.path("name").asText("");
                String singer = node.path("artistName").asText("");
                String image = node.path("artworkUrl100").asText("");
                String pageUrl = node.path("url").asText("");

                // 🎧 iTunes Lookup API로 previewUrl 가져오기
                String lookupJson = itunesWebClient.get()
                        .uri(uriBuilder -> uriBuilder
                                .path("/lookup")
                                .queryParam("id", musicId)
                                .queryParam("country", country)
                                .build())
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();

                String previewUrl = null;
                if (lookupJson != null && !lookupJson.isBlank()) {
                    JsonNode lookupRoot = objectMapper.readTree(lookupJson);
                    JsonNode results = lookupRoot.path("results");
                    if (results.isArray() && results.size() > 0) {
                        previewUrl = results.get(0).path("previewUrl").asText(null);
                    }
                }

                MusicVO vo = new MusicVO();
                vo.setMusicId(musicId);
                vo.setMusicTitle(title);
                vo.setMusicSinger(singer);
                vo.setMusicImagePath(image);
                vo.setMusicPreviewUrl(previewUrl); // ✅ 진짜 미리듣기 URL 저장
                vo.setMusicPlaytime("0");

                list.add(vo);
            }

            return list;
        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }

    @Override
    public List<MusicVO> fetchTopSongsFromDb() {
        return musicDAO.selectTopChartFromDb();
    }

}
