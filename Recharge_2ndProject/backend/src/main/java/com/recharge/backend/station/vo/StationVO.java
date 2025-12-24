package com.recharge.backend.station.vo;

import com.recharge.backend.charger.vo.ChargerVO;
import lombok.Data;

import java.util.List;

@Data
public class StationVO {

    private String stationId;
    private String stationName;
    private Double stationLatitude;
    private Double stationLongitude;
    private String stationAddress;
    private String stationAddressDetail;
    private String stationParkingFree;

    private String createId;
    private String updateId;
    private Double distanceKm;

    // 🔥 새로 추가된 필드
    private List<ChargerVO> chargers;
}
