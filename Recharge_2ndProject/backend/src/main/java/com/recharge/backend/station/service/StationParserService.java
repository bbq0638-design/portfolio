package com.recharge.backend.station.service;

import com.recharge.backend.station.vo.StationVO;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class StationParserService {

    public List<StationVO> parseStationList(String jsonString) {

        List<StationVO> stationList = new ArrayList<>();

        if(jsonString == null) return stationList;

        JSONObject root = new JSONObject(jsonString);

        if(!root.has("items")) return stationList;

        JSONObject items = root.getJSONObject("items");

        Object itemObj = items.get("item");

        JSONArray itemArray;

        if(itemObj instanceof JSONObject) {
            itemArray = new JSONArray();
            itemArray.put((JSONObject) itemObj);
        }else{
            itemArray = items.getJSONArray("item");
        }

        for(int i=0; i< itemArray.length(); i++){

            JSONObject obj = itemArray.getJSONObject(i);

            StationVO vo = new StationVO();

            String stationId = obj.optString("statId");

            if (stationId == null || stationId.isBlank() || stationId.equalsIgnoreCase("null")) {
                double lat = obj.optDouble("lat");
                double lng = obj.optDouble("lng");
                stationId = lat + "_" + lng;
            }

            vo.setStationId(stationId);

            vo.setStationName(obj.optString("statNm"));
            vo.setStationLatitude(obj.optDouble("lat"));
            vo.setStationLongitude(obj.optDouble("lng"));
            vo.setStationAddress(obj.optString("addr"));
            vo.setStationAddressDetail(obj.optString("addrDetail"));
            vo.setStationParkingFree(obj.optString("parkingFree"));

            vo.setCreateId("ADMIN");
            vo.setUpdateId("SYSTEM");

            stationList.add(vo);
        }

        return  stationList;
    }
}
