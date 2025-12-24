package com.recharge.backend.station.service;

import com.recharge.backend.station.vo.StationVO;

import java.util.List;

public interface StationService {

//    public void saveOrUpdateStation(StationVO station);
//
//    List<StationVO> findNearbyStations(double lat, double lng, double radius);

    List<StationVO> findNearbyStationsWithChargers(double lat, double lng, double radius);
}
