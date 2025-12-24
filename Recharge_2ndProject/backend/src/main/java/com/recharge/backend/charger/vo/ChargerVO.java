package com.recharge.backend.charger.vo;

import lombok.Data;

@Data
public class ChargerVO {
    private String chargerId;
    private String stationId;
    private String chargerProvider;
    private Integer chargerTotal;
    private String chargerType;
    private String chargerSpeed;
    private String status;

    private String createId;
    private String updateId;
}
