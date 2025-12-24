package com.recharge.backend.music.dao;

import com.recharge.backend.music.vo.MusicListVO;
import com.recharge.backend.music.vo.MusicPostVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface MusicPostDAO {

    Long getNextMusicPostId();
    Long getNextMusicListId();

    void insertMusicPost(MusicPostVO post);

    void insertMusicListBatch(Map<String, Object> param);

    List<MusicPostVO> selectAllPosts();
    MusicPostVO selectMusicPostDetail(Long musicPostId);
    List<MusicListVO> selectMusicListByPost(Long musicPostId);

    int existsMusic(Long musicId);

    void insertMusic(MusicListVO vo);
}