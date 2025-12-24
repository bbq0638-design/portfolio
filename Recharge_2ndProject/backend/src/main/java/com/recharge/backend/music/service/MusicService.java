package com.recharge.backend.music.service;

import com.recharge.backend.music.vo.MusicVO;

import java.util.List;

public interface MusicService {
    List<MusicVO> searchItunes(String term, int limit);
    int saveAll(List<MusicVO> list, String actorId);
    List<MusicVO> searchFromDb(String keyword);
    List<MusicVO> fetchTopSongsKr();
    List<MusicVO> fetchTopSongsFromDb();// 차트용
}
