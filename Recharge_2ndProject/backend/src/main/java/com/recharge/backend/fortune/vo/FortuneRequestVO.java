package com.recharge.backend.fortune.vo;

import lombok.Data;

@Data
public class FortuneRequestVO {
    private String gender;
    private String calendarType;
    private String birthdate;
    private String birthTime;
}