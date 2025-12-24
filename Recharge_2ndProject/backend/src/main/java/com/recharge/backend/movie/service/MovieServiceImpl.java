package com.recharge.backend.movie.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.recharge.backend.movie.dao.MovieDAO;
import com.recharge.backend.movie.vo.MovieVO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MovieServiceImpl implements MovieService {

    private final MovieDAO movieDAO;
    private final WebClient tmdbWebClient;

    public MovieServiceImpl(MovieDAO movieDAO, WebClient tmdbWebClient) {
        this.movieDAO = movieDAO;
        this.tmdbWebClient = tmdbWebClient;
    }

    @Value("${tmdb.apiKey}")
    private String apiKey;

    @Value("${tmdb.lang}")
    private String language;

    @Value("${tmdb.region}")
    private String region;

    /**
     * TMDB 장르코드 -> COMMON_CATEGORY_ID 조회 (DB 질의)
     * TB_COMMON_CATEGORY에 SYSTEM='TMDB' + CODE=tmdbGenreCode가 모두 등록되어 있어야 합니다.
     */
    private String resolveCommonCategoryId(int tmdbGenreCode) {
        return movieDAO.findCategoryIdByCode("TMDB", String.valueOf(tmdbGenreCode));
    }

    /**
     * TMDB의 genre_ids 배열에서 DB에 매핑 가능한 첫 번째 장르를 대표 장르로 선택
     * (모든 장르 허용. 대표 1개만 저장)
     */
    private String pickCommonCategoryId(JsonNode genreIdsNode) {
        if (genreIdsNode != null && genreIdsNode.isArray()) {
            for (JsonNode g : genreIdsNode) {
                String id = resolveCommonCategoryId(g.asInt());
                if (id != null) return id;
            }
        }
        return null;
    }

    /**
     * TMDB 상세 정보 조회: 줄거리/감독/출연(상위 5명)/트레일러(YouTube Trailer)
     */
    private Map<String, String> fetchDetailsFromTmdb(long tmdbId) {
        Map<String, String> map = new HashMap<>();
        try {
            String json = tmdbWebClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/movie/{id}")
                            .queryParam("api_key", apiKey)
                            .queryParam("language", language)
                            .queryParam("append_to_response", "credits,videos")
                            .build(tmdbId))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            ObjectMapper om = new ObjectMapper();
            JsonNode root = om.readTree(json);

            // 줄거리
            String overview = root.hasNonNull("overview") ? root.get("overview").asText() : null;

            // 감독
            String director = null;
            JsonNode crew = root.path("credits").path("crew");
            if (crew.isArray()) {
                for (JsonNode c : crew) {
                    if ("Director".equalsIgnoreCase(c.path("job").asText())) {
                        director = c.path("name").asText(null);
                        if (director != null) break;
                    }
                }
            }

            // 출연 (상위 5명)
            String actors = null;
            JsonNode cast = root.path("credits").path("cast");
            if (cast.isArray() && cast.size() > 0) {
                int take = Math.min(5, cast.size());
                actors = java.util.stream.StreamSupport.stream(cast.spliterator(), false)
                        .limit(take)
                        .map(n -> n.path("name").asText(""))
                        .filter(s -> !s.isEmpty())
                        .collect(Collectors.joining(", "));
            }

            // 트레일러 (YouTube Trailer 우선)
            String trailerUrl = null;
            JsonNode videos = root.path("videos").path("results");
            if (videos.isArray()) {
                for (JsonNode v : videos) {
                    String site = v.path("site").asText("");
                    String type = v.path("type").asText("");
                    if ("YouTube".equalsIgnoreCase(site) && "Trailer".equalsIgnoreCase(type)) {
                        String key = v.path("key").asText(null);
                        if (key != null && !key.isBlank()) {
                            trailerUrl = "https://www.youtube.com/watch?v=" + key;
                            break;
                        }
                    }
                }
            }

            map.put("overview", overview);
            map.put("director", director);
            map.put("actors", actors);
            map.put("trailerUrl", trailerUrl);
        } catch (Exception ignore) {
            // 필요 시 로깅
            // log.warn("TMDB 상세 조회 실패 id={}", tmdbId, ignore);
        }
        return map;
    }

    /**
     * TMDB 리스트 응답 공통 처리: DB MERGE (감독/출연/줄거리/트레일러 포함 저장)
     */
    private void upsertFromTmdbResults(JsonNode results) {
        if (results == null || !results.isArray()) return;

        for (JsonNode n : results) {
            Long tmdbId = n.get("id").asLong();
            String title = n.hasNonNull("title") ? n.get("title").asText() : null;
            String poster = n.hasNonNull("poster_path") ? n.get("poster_path").asText() : null;
            String backdrop = n.hasNonNull("backdrop_path") ? n.get("backdrop_path").asText() : null;
            Double score = n.hasNonNull("vote_average") ? n.get("vote_average").asDouble() : null;
            String releaseDate = n.hasNonNull("release_date") ? n.get("release_date").asText() : null;

            // 모든 장르 허용: 매핑 가능한 첫 장르를 대표로 선택
            String commonCategoryId = pickCommonCategoryId(n.get("genre_ids"));

            // NOT NULL 제약 대응: 매핑 실패 시 스킵
            if (commonCategoryId == null) {
                // System.out.println("장르 매핑 실패로 스킵: movieId=" + tmdbId + ", title=" + title);
                continue;
            }

            // 상세 정보 (감독/출연/줄거리/트레일러)
            Map<String, String> details = fetchDetailsFromTmdb(tmdbId);

            // VO 빌드 (MovieVO는 @Builder 지원해야 합니다. 아니면 setter로 대체)
            MovieVO m = MovieVO.builder()
                    .movieId(tmdbId)
                    .title(title)
                    .poster(poster)
                    .backdrop(backdrop)
                    .score(score)
                    .releaseDate((releaseDate != null && !releaseDate.isEmpty()) ? releaseDate : null)
                    .comment(details.get("overview"))
                    .director(details.get("director"))
                    .actor(details.get("actors"))
                    .trailer(details.get("trailerUrl"))
                    .commonCategoryId(commonCategoryId)
                    .build();

            System.out.printf("🎬 저장 시도: [%d] %s (%s)%n", tmdbId, title, commonCategoryId);
            int result = movieDAO.mergeMovie(m);
            System.out.println("저장 결과: " + result);
        }
    }

    /** TMDB 인기: MERGE 후 빈 리스트 반환 (저장용 엔드포인트) */
    @Transactional
    @Override
    public List<MovieVO> fetchPopularFromTmdb() {
        String json = tmdbWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/movie/popular")
                        .queryParam("api_key", apiKey)
                        .queryParam("language", language)
                        .queryParam("region", region)
                        .build())
                .retrieve()
                .bodyToMono(String.class)
                .block();

        try {
            ObjectMapper om = new ObjectMapper();
            JsonNode root = om.readTree(json);
            upsertFromTmdbResults(root.get("results"));
        } catch (Exception e) {
            throw new RuntimeException("TMDB 인기 영화 파싱 실패", e);
        }
        return List.of();
    }

    /** TMDB 현재상영: MERGE 후 빈 리스트 반환 (저장용 엔드포인트) */
    @Transactional
    @Override
    public List<MovieVO> fetchNowPlayingFromTmdb() {
        String json = tmdbWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/movie/now_playing")
                        .queryParam("api_key", apiKey)
                        .queryParam("language", language)
                        .queryParam("region", region)
                        .build())
                .retrieve()
                .bodyToMono(String.class)
                .block();

        try {
            ObjectMapper om = new ObjectMapper();
            JsonNode root = om.readTree(json);
            upsertFromTmdbResults(root.get("results"));
        } catch (Exception e) {
            throw new RuntimeException("TMDB 최신 영화 파싱 실패", e);
        }
        return List.of();
    }

    /** DB 인기순 조회 */
    @Override
    public List<MovieVO> getPopularFromDB(int page, int size) {
        int offset = Math.max(0, (page - 1) * size);
        int limit = size;
        return movieDAO.selectPopular(offset, limit);
    }

    /** DB 최신순 조회 */
    @Override
    public List<MovieVO> getLatestFromDB(int page, int size) {
        int offset = Math.max(0, (page - 1) * size);
        int limit = size;
        return movieDAO.selectLatest(offset, limit);
    }

    /** 단건 상세 조회 */
    @Override
    public MovieVO getMovieById(Long movieId) {
        return movieDAO.selectById(movieId);
    }
}
