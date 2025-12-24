package com.recharge.backend.movie.service;

import com.recharge.backend.movie.dao.MovieDAO;
import com.recharge.backend.movie.dao.MoviePostDAO;
import com.recharge.backend.movie.vo.MoviePostVO;
import com.recharge.backend.movie.vo.MovieVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MoviePostServiceImpl implements MoviePostService {

    private final MoviePostDAO moviePostDAO;
    private final MovieDAO movieDAO;

    @Override
    public Long getNextPostId() {
        return moviePostDAO.getNextPostId();
    }

    @Override
    public void insertMoviePost(MoviePostVO vo) {
        moviePostDAO.insertMoviePost(vo);
    }

    @Override
    public List<MoviePostVO> selectAll() {
        return moviePostDAO.selectAll();
    }

    @Override
    public void mergeMovie(MovieVO vo) {
        movieDAO.mergeMovie(vo);
    }

    @Override
    public String findCategoryIdByCode(String system, int code) {
        return movieDAO.findCategoryIdByCode(system, String.valueOf(code));
    }

    @Override
    public MoviePostVO selectById(Long postId) {
        return moviePostDAO.selectById(postId);
    }
}
