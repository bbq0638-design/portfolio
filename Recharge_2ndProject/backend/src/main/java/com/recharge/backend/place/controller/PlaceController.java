package com.recharge.backend.place.controller;

import com.recharge.backend.place.service.PlaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/place")
public class PlaceController {

    @Autowired
    private PlaceService placeService;

    @GetMapping("/nearby")
    public Map<String, Object> getNearby(@RequestParam double lat, @RequestParam double lng) {
        return placeService.searchNearby(lat, lng);
    }
}
