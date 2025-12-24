package com.recharge.backend.music.service;

import com.recharge.backend.music.dao.MusicPostDAO;
import com.recharge.backend.music.vo.MusicListVO;
import com.recharge.backend.music.vo.MusicPostVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MusicPostServiceImpl implements MusicPostService {

    private final MusicPostDAO musicPostDAO;

    /**
     * 🎵 음악 게시글 + MUSIC_LIST + TB_MUSIC 동기화까지 한 번에 처리
     */
    @Override
    @Transactional
    public Long createPostWithPlaylist(MusicPostVO post, List<MusicListVO> playlist) {

        // 1) 게시글 PK 생성
        Long nextPostId = musicPostDAO.getNextMusicPostId();
        post.setMusicPostId(nextPostId);

        // 2) 게시글 INSERT
        musicPostDAO.insertMusicPost(post);

        // 3) 리스트 PK 시작값
        long nextListId = musicPostDAO.getNextMusicListId();

        // 4) LIST PK 부여
        for (int i = 0; i < playlist.size(); i++) {
            MusicListVO item = playlist.get(i);
            item.setMusicListId(nextListId + i);
        }

        // 5) TB_MUSIC_LIST BULK INSERT
        Map<String, Object> param = new HashMap<>();
        param.put("postId", nextPostId);
        param.put("userId", post.getUserId()); // 작성자
        param.put("list", playlist);

        musicPostDAO.insertMusicListBatch(param);

        // 6) TB_MUSIC 동기화 (중복 방지)
        for (MusicListVO item : playlist) {
            int exists = musicPostDAO.existsMusic(item.getMusicId());
            if (exists == 0) {
                musicPostDAO.insertMusic(item);   // TB_MUSIC 에 곡 정보 갱신
            }
        }

        return nextPostId;
    }

    @Override
    public MusicPostVO getPostDetail(Long postId) {
        return musicPostDAO.selectMusicPostDetail(postId);
    }

    @Override
    public List<MusicListVO> getMusicList(Long postId) {
        return musicPostDAO.selectMusicListByPost(postId);
    }

    @Override
    public List<MusicPostVO> getAllPosts() {
        return musicPostDAO.selectAllPosts();
    }
}
