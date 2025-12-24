package com.recharge.backend.place.service;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PlaceService {

    @Value("${kakao.rest-api-key}")
    private String restApiKey;

    public Map<String, Object> searchNearby(double lat, double lng) {

        Map<String, Object> result = new HashMap<>();

        try {
            RestTemplate rest = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "KakaoAK " + restApiKey);

            HttpEntity<?> entity = new HttpEntity<>(headers);

            // 🍽 음식점 (FD6)
            String urlFood =
                    "https://dapi.kakao.com/v2/local/search/category.json"
                            + "?category_group_code=FD6"
                            + "&x=" + lng
                            + "&y=" + lat
                            + "&radius=1500";

            ResponseEntity<String> foodRes =
                    rest.exchange(urlFood, HttpMethod.GET, entity, String.class);

            JSONObject foodJson = new JSONObject(foodRes.getBody());
            JSONArray foodDocs = foodJson.getJSONArray("documents");
            List<Object> foodList = foodDocs.toList();  // ⬅️ 확실한 List 변환
            result.put("food", foodList);


            // ☕ 카페 (CE7)
            String urlCafe =
                    "https://dapi.kakao.com/v2/local/search/category.json"
                            + "?category_group_code=CE7"
                            + "&x=" + lng
                            + "&y=" + lat
                            + "&radius=1500";

            ResponseEntity<String> cafeRes =
                    rest.exchange(urlCafe, HttpMethod.GET, entity, String.class);

            JSONObject cafeJson = new JSONObject(cafeRes.getBody());
            JSONArray cafeDocs = cafeJson.getJSONArray("documents");
            List<Object> cafeList = cafeDocs.toList();  // ⬅️ 확실한 List 변환
            result.put("cafe", cafeList);

            return result;

        } catch (Exception e) {
            e.printStackTrace();
            result.put("error", e.getMessage());
            return result;
        }
    }
}
