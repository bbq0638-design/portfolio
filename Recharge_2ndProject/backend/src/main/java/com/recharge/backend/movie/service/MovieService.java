package com.recharge.backend.movie.service;


import com.recharge.backend.movie.vo.MovieVO;
import java.util.List;

public interface MovieService {

    List<MovieVO> fetchPopularFromTmdb();

    List<MovieVO> fetchNowPlayingFromTmdb();

    List<MovieVO> getPopularFromDB(int page, int size);

    List<MovieVO> getLatestFromDB(int page, int size);

    MovieVO getMovieById(Long movieId);

}
