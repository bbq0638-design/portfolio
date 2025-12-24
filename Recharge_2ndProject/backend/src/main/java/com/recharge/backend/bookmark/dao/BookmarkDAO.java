package com.recharge.backend.bookmark.dao;

import com.recharge.backend.bookmark.vo.BookmarkVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface BookmarkDAO {
    int existsBookmark(BookmarkVO vo);

    int insertBookmark(BookmarkVO vo);

    int deleteBookmark(BookmarkVO vo);

    List<BookmarkVO> getMovieBookmarks(String userId);

    List<BookmarkVO> getMusicBookmarks(String userId);

    List<BookmarkVO> getMoviePostBookmarks(String userId);


}
