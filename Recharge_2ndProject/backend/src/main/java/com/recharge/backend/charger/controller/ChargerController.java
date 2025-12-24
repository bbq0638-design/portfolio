package com.recharge.backend.charger.controller;

import com.recharge.backend.charger.service.ChargerApiService;
import com.recharge.backend.charger.service.ChargerService;
import com.recharge.backend.charger.vo.ChargerVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/charger")
public class ChargerController {

    @Autowired
    private ChargerApiService chargerApiService;

    @Autowired
    private ChargerService chargerService;
//

    /// /    @GetMapping("/test")
    /// /    public String testChargerApi(){
    /// /        return chargerApiService.testCall();
    /// /    }
    /// /
    /// /    @GetMapping("/parsingtest")
    /// /    public String testParsing(){
    /// /        return chargerApiService.parsingtest();
    /// /    }
    /// /
    /// /    @GetMapping("/save-test")
    /// /    public String saveTest() {
    /// /
    /// /        String json = chargerApiService.testCall();
    /// /        System.out.println("API 결과" + json);
    /// /
    /// /        ChargerVO vo = chargerApiService.parseOneChargerObject();
    /// /        System.out.println("파싱 결과 VO = " + vo);
    /// /
    /// /        int result = chargerService.saveCharger(vo);
    /// /
    /// /        return (result > 0) ? "인설트성공" : "인설트 실패";
    /// /    }
//
    @GetMapping("/save-all")
    public String saveAll() {

        List<ChargerVO> chargers = chargerApiService.parseChargers();

        System.out.println("파싱 된 충남 충전기 수 = " + chargers.size());

        int success = 0;

        for (ChargerVO vo : chargers) {
            success += chargerService.saveCharger(vo);
        }

        return "총 파싱:" + chargers.size() + " / 저장 성공: " + success;
    }
}
//
//    @GetMapping("/station/{stationId}")
//    public List<ChargerVO> getStationWithStatus(@PathVariable String stationId) {
//        return chargerService.getChargersWithStatus(stationId);
//    }
//
//    @GetMapping("/status-test")
//    public List<ChargerVO> testStatus(@RequestParam(defaultValue = "10") int count) {
//
//        // 실시간 상태  전체 리스트 호출
//        List<ChargerVO> list = chargerApiService.fetchRealTimeStatus();
//
//        // count보다 적으면 전체 리턴
//        if (list.size() <= count) {
//            return list;
//        }
//
//        // 앞에서부터 count개만 잘라서 반환
//        return list.subList(0, count);
//    }
//
//}
