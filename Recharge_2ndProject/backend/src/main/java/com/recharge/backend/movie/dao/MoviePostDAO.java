package com.recharge.backend.movie.dao;

import com.recharge.backend.movie.vo.MoviePostVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MoviePostDAO {
    Long getNextPostId();
    void insertMoviePost(MoviePostVO vo);
    List<MoviePostVO> selectAll();

    MoviePostVO selectById(Long postId);
}
