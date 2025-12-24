package com.recharge.backend.placeImage.controller;

import com.recharge.backend.placeImage.service.PlaceImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/place/image")
@RequiredArgsConstructor
public class PlaceImageController {

    private final PlaceImageService placeImageService;

    @GetMapping
    public String getPlaceImage(@RequestParam String query) {
        return placeImageService.getImage(query);
    }
}
