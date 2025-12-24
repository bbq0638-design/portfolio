package com.recharge.backend.bookmark.controller;

import com.recharge.backend.bookmark.service.BookmarkService;
import com.recharge.backend.bookmark.vo.BookmarkVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/bookmark")
public class BookmarkController {

    private final BookmarkService bookmarkService;

    // ⭐ 북마크 토글 (추가/삭제)
    @PostMapping("/toggle")
    public boolean toggleBookmark(@RequestBody BookmarkVO vo) {
        return bookmarkService.toggleBookmark(vo);
    }

    // 🎬 영화 북마크 목록
    @GetMapping("/movie/{userId}")
    public List<BookmarkVO> getMovieBookmarks(@PathVariable String userId) {
        return bookmarkService.getMovieBookmarks(userId);
    }

    // 🎵 음악 북마크 목록
    @GetMapping("/music/{userId}")
    public List<BookmarkVO> getMusicBookmarks(@PathVariable String userId) {
        return bookmarkService.getMusicBookmarks(userId);
    }

    // 📝 영화 게시글(MoviePost) 북마크 목록
    @GetMapping("/moviepost/{userId}")
    public List<BookmarkVO> getMoviePostBookmarks(@PathVariable String userId) {
        return bookmarkService.getMoviePostBookmarks(userId);
    }
}
