package com.recharge.backend.station.controller;

import com.recharge.backend.station.service.EvApiService;
import com.recharge.backend.station.service.StationParserService;
import com.recharge.backend.station.service.StationService;
import com.recharge.backend.station.vo.StationVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping ("/api/station")
public class StationController {

    @Autowired
    private EvApiService evApiService;

    @Autowired
    private StationParserService stationParserService;

    @Autowired
    private StationService stationService;

//    @GetMapping("/test")
//    public String testApiCall(){
//        String result = evApiService.fetchChargerInfo(1,10);
//        return result !=null ? result : "API 호출 실패";
//    }
//
//    @GetMapping(value = "/parse-test", produces = "application/json;charset=UTF-8")
//    public List<StationVO> testParse(){
//        String jason = evApiService.fetchChargerInfo(1,10);
//
//        List<StationVO> list = stationParserService.parseStationList(jason);
//
//        return list;
//    }

//    @GetMapping("/load-all")
//    public String loadAllStations() {
//
//        batchService.batchSaveStation();
//
//        return "OK";
//    }
//
//    @GetMapping("/nearby")
//    public List<StationVO> getNearbyStations(
//            @RequestParam double lat,
//            @RequestParam double lng,
//            @RequestParam double radius
//    ){
//        return stationService.findNearbyStations(lat,lng,radius);
//    }

    @GetMapping("/nearby-with-chargers")
    public List<StationVO> getNearbyStationsWithChargers(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam double radius
    ) {
        return stationService.findNearbyStationsWithChargers(lat, lng, radius);
    }
}