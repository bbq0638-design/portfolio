package com.recharge.backend.movie.vo;

import lombok.Data;
import java.util.Date;

@Data
public class MoviePostVO {
    private Long moviePostId;
    private String userId;
    private Long movieId;
    private String moviePostTitle;
    private String moviePostText;
    private Date createDate;
    private String createId;
    private Date updatedDate;
    private String updatedId;

    // join용
    private String movieTitle;
    private String poster;
    private Double score;
}
