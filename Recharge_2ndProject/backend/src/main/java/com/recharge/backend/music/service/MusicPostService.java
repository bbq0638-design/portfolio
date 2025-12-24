package com.recharge.backend.music.service;

import com.recharge.backend.music.vo.MusicListVO;
import com.recharge.backend.music.vo.MusicPostVO;

import java.util.List;

public interface MusicPostService {

    Long createPostWithPlaylist(MusicPostVO postVO, List<MusicListVO> playlist);

    MusicPostVO getPostDetail(Long postId);

    List<MusicListVO> getMusicList(Long postId);

    List<MusicPostVO> getAllPosts();
}