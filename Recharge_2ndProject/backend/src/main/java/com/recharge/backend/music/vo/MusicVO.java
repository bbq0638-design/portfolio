package com.recharge.backend.music.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MusicVO {
    private Long musicId;              // iTunes trackId
    private String musicImagePath;     // 앨범아트 URL
    private String musicPreviewUrl;    // 30초 미리듣기 URL (nullable)
    private String musicTitle;         // 곡명
    private String musicSinger;        // 가수명
    private String musicPlaytime;      // "MM:SS"
    private Long musicPlaytimeMs;      // 밀리초 (검색 응답용)

    // 공통감사 컬럼 (DB 매핑용)
    private LocalDateTime createDate;
    private String createId;
    private LocalDateTime updatedDate;
    private String updatedId;
}
