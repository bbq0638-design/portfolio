package com.recharge.backend.music.controller;

import com.recharge.backend.music.service.MusicPostService;
import com.recharge.backend.music.vo.MusicListVO;
import com.recharge.backend.music.vo.MusicPostVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/musicpost")
public class MusicPostController {

    private final MusicPostService musicPostService;

    @PostMapping("/add")
    public Long add(@RequestBody Map<String, Object> payload) {

        // -------------------------------
        // 1) 게시글 정보 안전하게 파싱
        // -------------------------------
        MusicPostVO post = new MusicPostVO();
        post.setUserId((String) payload.getOrDefault("userId", ""));
        post.setMusicPostTitle(
                (String) payload.getOrDefault("musicPostTitle",
                        payload.getOrDefault("title", ""))
        );
        post.setMusicPostText(
                (String) payload.getOrDefault("musicPostText",
                        payload.getOrDefault("content", ""))
        );
        post.setCreateId(post.getUserId());
        post.setUpdatedId(post.getUserId());

        // -------------------------------
        // 2) playlist 안전하게 추출 (unchecked 제거)
        // -------------------------------
        Object rawList = payload.get("playlist");

        List<Map<String, Object>> listMap = new ArrayList<>();

        if (rawList instanceof List<?> raw) {
            for (Object item : raw) {
                if (item instanceof Map<?, ?> map) {
                    // 안전하게 String,Object map으로 변환
                    Map<String, Object> safeMap = new HashMap<>();
                    map.forEach((k, v) -> safeMap.put(String.valueOf(k), v));
                    listMap.add(safeMap);
                }
            }
        }

        List<MusicListVO> playlist = new ArrayList<>();

        for (Map<String, Object> m : listMap) {
            MusicListVO vo = new MusicListVO();

            Object mid = m.get("musicId");
            if (mid != null) {
                vo.setMusicId(Long.valueOf(mid.toString()));
            }

            vo.setMusicTitle((String) m.getOrDefault("musicTitle", ""));
            vo.setMusicSinger((String) m.getOrDefault("musicSinger", ""));
            vo.setMusicImagePath((String) m.getOrDefault("musicImagePath", ""));
            vo.setMusicPreviewUrl((String) m.getOrDefault("musicPreviewUrl", ""));
            vo.setCreateId(post.getUserId());
            vo.setUpdatedId(post.getUserId());

            playlist.add(vo);
        }

        // -------------------------------
        // 4) Service 호출
        // -------------------------------
        return musicPostService.createPostWithPlaylist(post, playlist);
    }

    @GetMapping("/{postId}")
    public Map<String, Object> detail(@PathVariable Long postId) {
        Map<String, Object> result = new HashMap<>();
        result.put("post", musicPostService.getPostDetail(postId));
        result.put("playlist", musicPostService.getMusicList(postId));
        return result;
    }

    @GetMapping("/list")
    public List<MusicPostVO> list() {
        return musicPostService.getAllPosts();
    }
}
