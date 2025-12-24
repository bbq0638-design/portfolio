package com.recharge.backend.charger.dao;


import com.recharge.backend.charger.vo.ChargerVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;


@Mapper
public interface ChargerDAO {

    int existsCharger(@Param("stationId") String stationId,
                      @Param("chargerId") String chargerId);

    int insertCharger(ChargerVO charger);

    List<ChargerVO> findByStationId(@Param("stationId") String stationId);

    List<ChargerVO> findByStationIds(@Param("stationIds") List<String> stationIds);
}

