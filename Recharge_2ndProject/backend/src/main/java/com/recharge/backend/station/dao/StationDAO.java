package com.recharge.backend.station.dao;

import com.recharge.backend.station.vo.StationVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface StationDAO {

    int existsStation(String stationId);

    int insertStation(StationVO station);

    int updateStation(StationVO station);

    List<StationVO> findNearbyStations(
            @Param("lat") double lat,
            @Param("lng") double lng,
            @Param("radius") double radius
    );
}
