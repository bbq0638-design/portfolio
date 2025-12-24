package com.recharge.backend.movie.vo;

import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieVO {
    private Long movieId;
    private String commonCategoryId;
    private String genreName;
    private String poster;
    private String backdrop;
    private String title;
    private Double score;
    private String comment;
    private String director;
    private String actor;
    private String releaseDate;
    private String trailer;

}
