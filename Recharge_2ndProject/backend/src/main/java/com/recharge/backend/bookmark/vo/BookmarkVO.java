package com.recharge.backend.bookmark.vo;

import lombok.Data;

@Data
public class BookmarkVO {

    private String bookmarkId;
    private String bookmarkTargetType;
    private Long bookmarkTargetId;
    private String userId;

    private Long movieId;
    private String title;
    private String poster;

    private Long musicId;
    private String albumArt;
    private String singer;

    private Long moviePostId;

    private String createId;
    private String updatedId;
}
