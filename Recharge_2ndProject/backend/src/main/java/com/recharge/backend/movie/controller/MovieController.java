package com.recharge.backend.movie.controller;

import com.recharge.backend.movie.service.MovieService;
import com.recharge.backend.movie.vo.MovieVO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    // ✅ TMDB → DB 동기화 (인기/현재상영 모두) : 수동 트리거
    @PostMapping("/sync")
    public ResponseEntity<Void> syncFromTmdb() {
        movieService.fetchPopularFromTmdb();
        movieService.fetchNowPlayingFromTmdb();
        return ResponseEntity.ok().build();
    }

    // ✅ 목록 조회 : sort=popular | latest (기본 popular)
    //    GET /recharge/api/movies?sort=popular&page=1&size=12
    @GetMapping
    public List<MovieVO> listMovies(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "popular") String sort
    ) {
        if ("latest".equalsIgnoreCase(sort)) {
            return movieService.getLatestFromDB(page, size);
        }
        return movieService.getPopularFromDB(page, size);
    }

    // ✅ 단건 조회
    //    GET /recharge/api/movies/{movieId}
    @GetMapping("/{movieId}")
    public MovieVO getMovieDetail(@PathVariable Long movieId) {
        return movieService.getMovieById(movieId);
    }

}
