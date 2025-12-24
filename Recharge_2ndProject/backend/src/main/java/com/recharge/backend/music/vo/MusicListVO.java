package com.recharge.backend.music.vo;


import lombok.Data;


@Data
public class MusicListVO {
    private Long musicListId; // PK
    private Long musicPostId; // FK → TB_MUSIC_POST.MUSIC_POST_ID


    // 트랙 정보
    private Long musicId; // (예: iTunes trackId)
    private String musicTitle; // 곡명
    private String musicSinger; // 가수명
    private String musicImagePath; // 앨범아트 URL
    private String musicPreviewUrl;// 30초 미리듣기(선택)


    // 감사 공통
    private String createId;
    private String updatedId;
}