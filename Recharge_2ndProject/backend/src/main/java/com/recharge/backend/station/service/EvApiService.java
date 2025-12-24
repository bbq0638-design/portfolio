package com.recharge.backend.station.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class EvApiService {

    @Value("${evapi.base-url}")
    private String baseUrl;

    @Value("${evapi.key}")
    private String serviceKey;

    public String fetchChargerInfo(int pageNO, int numOfRows, String zcode) {

        try{
            String url = baseUrl
                    +"?serviceKey=" + serviceKey
                    +"&pageNo=" + pageNO
                    +"&numOfRows=" + numOfRows
                    +"&dataType=JSON"
                    +"&zcode=" + zcode;

            RestTemplate restTemplate = new RestTemplate();
            return restTemplate.getForObject(url, String.class);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}
