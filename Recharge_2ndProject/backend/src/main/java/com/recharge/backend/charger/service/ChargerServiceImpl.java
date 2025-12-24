package com.recharge.backend.charger.service;

import com.recharge.backend.charger.dao.ChargerDAO;
import com.recharge.backend.charger.vo.ChargerVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChargerServiceImpl implements ChargerService{
//
    @Autowired
    private ChargerDAO chargerDAO;

    @Autowired
    private ChargerApiService chargerApiService;

    @Override
    public int saveCharger(ChargerVO charger) {

        int exist = chargerDAO.existsCharger(
                charger.getStationId(),
                charger.getChargerId()
        );

        if(exist > 0) {
            System.out.println("이미 존재하는 충전기 -> insert skip");
            return 0;
        }

        return chargerDAO.insertCharger(charger);
    }
}
//
//    @Override
//    public List<ChargerVO> getChargersWithStatus(String stationId) {
//
//        // 1) DB에서 charger 리스트 조회
//        List<ChargerVO> chargerList = chargerDAO.findByStationId(stationId);
//
//        // 2) 실시간 상태 모두 조회
//        List<ChargerVO> statusList = chargerApiService.fetchRealTimeStatus();
//
//        // 3) 빠르게 검색할 수 있도록 Map으로 변환 (stationId+chargerId → status)
//        Map<String, String> statusMap = statusList.stream()
//                .collect(Collectors.toMap(
//                        v -> v.getStationId() + "_" + v.getChargerId(),
//                        ChargerVO::getStatus,
//                        (a, b) -> b    // 충돌 시 뒤에 값 사용
//                ));
//
//        // 4) DB chargerList에 실시간 status 매핑
//        for (ChargerVO vo : chargerList) {
//            String key = vo.getStationId() + "_" + vo.getChargerId();
//            vo.setStatus(statusMap.getOrDefault(key, "0"));  // 없으면 "0"(알수없음)
//        }
//
//        return chargerList;
//    }
//}
