package com.recharge.backend.movie.dao;

import com.recharge.backend.movie.vo.MovieVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MovieDAO {
    List<MovieVO> selectPopular(@Param("offset") int offset, @Param("limit") int limit);

    List<MovieVO> selectLatest(@Param("offset") int offset, @Param("limit") int limit);

    MovieVO selectById(@Param("movieId") Long movieId);

    int mergeMovie(MovieVO movie);

    String findCategoryIdByCode(@Param("system") String system, @Param("code") String code);

}
