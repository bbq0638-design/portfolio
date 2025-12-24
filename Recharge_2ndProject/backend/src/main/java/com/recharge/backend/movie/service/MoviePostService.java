package com.recharge.backend.movie.service;

import com.recharge.backend.movie.vo.MoviePostVO;
import com.recharge.backend.movie.vo.MovieVO;

import java.util.List;

public interface MoviePostService {
    Long getNextPostId();
    void insertMoviePost(MoviePostVO vo);
    List<MoviePostVO> selectAll();

    void mergeMovie(MovieVO vo);
    String findCategoryIdByCode(String system, int code);

    MoviePostVO selectById(Long postId);
}
