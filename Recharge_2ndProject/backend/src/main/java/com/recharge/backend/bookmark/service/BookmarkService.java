package com.recharge.backend.bookmark.service;

import com.recharge.backend.bookmark.vo.BookmarkVO;

import java.util.List;

public interface BookmarkService {

    boolean toggleBookmark(BookmarkVO vo);

    List<BookmarkVO> getMovieBookmarks(String userId);

    List<BookmarkVO> getMusicBookmarks(String userId);

    List<BookmarkVO> getMoviePostBookmarks(String userId);
}
