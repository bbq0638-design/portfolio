package com.recharge.backend.music.vo;


import lombok.Data;

import java.util.Date;
import java.util.List;


@Data
public class MusicPostVO {
    private Long musicPostId;
    private String userId;
    private String musicPostTitle;
    private String musicPostText;

    private String createId;
    private String updatedId;

    private String firstImagePath;
}