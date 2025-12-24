package com.recharge.backend.movie.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.recharge.backend.movie.dao.MovieDAO;
import com.recharge.backend.movie.service.MoviePostService;
import com.recharge.backend.movie.vo.MoviePostVO;
import com.recharge.backend.movie.vo.MovieVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;

@RestController
@RequestMapping("/api/moviepost")
@RequiredArgsConstructor
public class MoviePostController {

    private final MoviePostService moviePostService;
    private final MovieDAO movieDAO;          // 장르코드 매핑 & MERGE용
    private final WebClient tmdbWebClient;    // TMDB 호출용 (apiKey 등은 Bean 구성에서 붙어있다고 가정)

    // 🔍 TMDB 검색 (기존 유지)
    @GetMapping("/search")
    public ResponseEntity<?> searchMovie(@RequestParam String query) {
        try {
            ObjectMapper mapper = new ObjectMapper();

            String searchJson = tmdbWebClient.get()
                    .uri(uri -> uri.path("/search/movie")
                            .queryParam("query", query)
                            .build())
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode root = mapper.readTree(searchJson);
            JsonNode results = root.path("results");
            if (!results.isArray() || results.size() == 0) {
                return ResponseEntity.ok(Map.of("message", "검색 결과 없음"));
            }

            JsonNode first = results.get(0);
            int tmdbId = first.path("id").asInt();

            String detailJson = tmdbWebClient.get()
                    .uri(uri -> uri.path("/movie/{id}")
                            .queryParam("append_to_response", "credits")
                            .build(tmdbId))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode detail = mapper.readTree(detailJson);

            // 장르/감독/배우 간단 파싱
            List<String> genres = new ArrayList<>();
            detail.path("genres").forEach(g -> genres.add(g.path("name").asText("")));

            String director = "";
            for (JsonNode c : detail.path("credits").path("crew")) {
                if ("Director".equalsIgnoreCase(c.path("job").asText())) {
                    director = c.path("name").asText("");
                    break;
                }
            }

            List<String> topActors = new ArrayList<>();
            for (JsonNode c : detail.path("credits").path("cast")) {
                if (topActors.size() >= 3) break;
                String name = c.path("name").asText("");
                if (!name.isBlank()) topActors.add(name);
            }

            Map<String, Object> result = Map.of(
                    "tmdbId", tmdbId,
                    "title", detail.path("title").asText(""),
                    "poster", "https://image.tmdb.org/t/p/w500" + detail.path("poster_path").asText(""),
                    "releaseDate", detail.path("release_date").asText(""),
                    "score", detail.path("vote_average").asDouble(0.0),
                    "genre", String.join(", ", genres),
                    "director", director,
                    "actor", String.join(", ", topActors)
            );

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    // 📝 추천글 등록 (핵심: TMDB 상세 → TB_MOVIE MERGE → TB_MOVIE_POST INSERT)
    @PostMapping("/add")
    public ResponseEntity<?> addMoviePost(@RequestBody MoviePostVO vo) {
        try {
            // 1) 게시글 번호 채번 & 기본 userId
            Long nextPostId = moviePostService.getNextPostId();
            vo.setMoviePostId(nextPostId);
            if (vo.getUserId() == null || vo.getUserId().isBlank()) {
                vo.setUserId("guest");
            }

            // 2) TMDB 상세 + 크레딧 + 비디오까지 가져와서 영화정보 구성
            ObjectMapper mapper = new ObjectMapper();
            String detailJson = tmdbWebClient.get()
                    .uri(uri -> uri.path("/movie/{id}")
                            .queryParam("append_to_response", "credits,videos") // 트레일러 위해 videos 추가
                            .queryParam("language", "ko-KR")
                            .build(vo.getMovieId()))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode detail = mapper.readTree(detailJson);

            // 개요(줄거리)
            String overview = detail.path("overview").asText(null);

            // 감독
            String director = null;
            for (JsonNode c : detail.path("credits").path("crew")) {
                if ("Director".equalsIgnoreCase(c.path("job").asText())) {
                    director = c.path("name").asText(null);
                    if (director != null) break;
                }
            }

            // 배우 상위 5명
            String actors = null;
            JsonNode cast = detail.path("credits").path("cast");
            if (cast.isArray() && cast.size() > 0) {
                List<String> names = new ArrayList<>();
                for (int i = 0; i < Math.min(5, cast.size()); i++) {
                    String n = cast.get(i).path("name").asText("");
                    if (!n.isBlank()) names.add(n);
                }
                if (!names.isEmpty()) actors = String.join(", ", names);
            }

            // 트레일러 (YouTube Trailer 우선)
            String trailerUrl = null;
            for (JsonNode v : detail.path("videos").path("results")) {
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

            // 대표 장르 매핑 → COMMON_CATEGORY_ID (TB_COMMON_CATEGORY에 TMDB 코드가 저장되어 있어야 함)
            String commonCategoryId = null;
            for (JsonNode g : detail.path("genres")) {
                int tmdbGenreCode = g.path("id").asInt();      // 예: 28, 35 ...
                String code = String.valueOf(tmdbGenreCode);   // findCategoryIdByCode는 (system:String, code:String)
                commonCategoryId = movieDAO.findCategoryIdByCode("TMDB", code);
                if (commonCategoryId != null) break;
            }
            // 안전장치(선택): 매핑 실패 시 기본 장르로 대체
            if (commonCategoryId == null) {
                commonCategoryId = "TMDB1"; // 액션 등, 실제 테이블에 존재하는 값으로
            }

            // 3) TB_MOVIE MERGE (movie.xml의 NVL 업데이트 규칙 전제)
            MovieVO m = MovieVO.builder() // 빌더가 없다면 setter로 대체하세요.
                    .movieId(vo.getMovieId())
                    .title(detail.path("title").asText(null))
                    .poster(detail.path("poster_path").asText(null))        // 상대경로 저장 (프론트에서 TMDB base 붙임)
                    .backdrop(detail.path("backdrop_path").asText(null))
                    .score(detail.path("vote_average").asDouble())
                    .releaseDate(detail.path("release_date").asText(null))  // 'YYYY-MM-DD'
                    .comment(overview)
                    .director(director)
                    .actor(actors)
                    .trailer(trailerUrl)
                    .commonCategoryId(commonCategoryId)
                    .build();

            movieDAO.mergeMovie(m);

            // 4) TB_MOVIE_POST INSERT
            moviePostService.insertMoviePost(vo);

            return ResponseEntity.ok("success");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    // 📋 추천글 목록
    @GetMapping("/list")
    public ResponseEntity<?> listMoviePosts() {
        return ResponseEntity.ok(moviePostService.selectAll());
    }

    @GetMapping("/{postId}")
    public ResponseEntity<?> getMoviePostDetail(@PathVariable Long postId) {
        MoviePostVO post = moviePostService.selectById(postId);
        if (post == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(post);
    }
}
