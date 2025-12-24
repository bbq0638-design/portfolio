package com.recharge.backend.bookmark.service;

import com.recharge.backend.bookmark.dao.BookmarkDAO;
import com.recharge.backend.bookmark.vo.BookmarkVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookmarkServiceImpl implements BookmarkService {

    private final BookmarkDAO bookmarkDAO;

    // ⭐ 토글 로직
    @Transactional
    @Override
    public boolean toggleBookmark(BookmarkVO vo) {

        int exists = bookmarkDAO.existsBookmark(vo);

        // 이미 북마크 되어 있으면 → 삭제
        if (exists > 0) {
            bookmarkDAO.deleteBookmark(vo);
            return false; // 삭제됨
        }

        // 북마크 없으면 → 추가
        bookmarkDAO.insertBookmark(vo);
        return true; // 추가됨
    }

    // 🎬 영화 북마크 목록
    @Override
    public List<BookmarkVO> getMovieBookmarks(String userId) {
        return bookmarkDAO.getMovieBookmarks(userId);
    }

    // 🎵 음악 북마크 목록
    @Override
    public List<BookmarkVO> getMusicBookmarks(String userId) {
        return bookmarkDAO.getMusicBookmarks(userId);
    }

    // 📝 영화 게시글 북마크 목록
    @Override
    public List<BookmarkVO> getMoviePostBookmarks(String userId) {
        return bookmarkDAO.getMoviePostBookmarks(userId);
    }
}
