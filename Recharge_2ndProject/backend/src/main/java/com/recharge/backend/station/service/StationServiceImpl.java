package com.recharge.backend.station.service;

import com.recharge.backend.charger.dao.ChargerDAO;
import com.recharge.backend.charger.service.ChargerApiService;
import com.recharge.backend.charger.vo.ChargerVO;
import com.recharge.backend.station.dao.StationDAO;
import com.recharge.backend.station.vo.StationVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StationServiceImpl implements StationService {

    @Autowired
    private StationDAO stationDAO;

    @Autowired
    private ChargerDAO chargerDAO;

    @Autowired
    private ChargerApiService chargerApiService;

    @Override
    public List<StationVO> findNearbyStationsWithChargers(double lat, double lng, double radius) {

        // 1) 반경 내 스테이션 조회
        List<StationVO> stationList = stationDAO.findNearbyStations(lat, lng, radius);

        if (stationList.isEmpty()) {
            return stationList;
        }

        // 2) 스테이션 ID 목록 추출
        List<String> stationIds = stationList.stream()
                .map(StationVO::getStationId)
                .collect(Collectors.toList());

        // 3) DB 충전기 전체 조회 (IN 절)
        List<ChargerVO> allChargers = findByStationIdsSafe(stationIds);

        // 4) 실시간 API 전체 호출 → 딱 한 번만!
        List<ChargerVO> statusList = chargerApiService.fetchRealTimeStatus();

        // 5) 실시간 상태 Map (stationId+chargerId → status)
        Map<String, String> statusMap = statusList.stream()
                .collect(Collectors.toMap(
                        vo -> vo.getStationId() + "_" + vo.getChargerId(),
                        ChargerVO::getStatus,
                        (a, b) -> b
                ));

        // 6) DB 충전기에 실시간 상태 매핑
        for (ChargerVO ch : allChargers) {
            String key = ch.getStationId() + "_" + ch.getChargerId();
            ch.setStatus(statusMap.getOrDefault(key, "0"));
        }

        // 7) stationId 기준으로 그룹핑
        Map<String, List<ChargerVO>> grouped =
                allChargers.stream().collect(Collectors.groupingBy(ChargerVO::getStationId));

        // 8) station에 charger 리스트 넣기
        for (StationVO st : stationList) {
            st.setChargers(grouped.getOrDefault(st.getStationId(), new ArrayList<>()));
        }

        return stationList;
    }

    private List<ChargerVO> findByStationIdsSafe(List<String> ids) {
        List<ChargerVO> result = new ArrayList<>();
        int CHUNK_SIZE = 900; // 1000 제한보다 조금 여유

        for (int i = 0; i < ids.size(); i += CHUNK_SIZE) {
            List<String> subList = ids.subList(i, Math.min(i + CHUNK_SIZE, ids.size()));
            result.addAll(chargerDAO.findByStationIds(subList));
        }

        return result;
    }
}

