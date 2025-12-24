package com.recharge.backend.fortune.controller;

import com.recharge.backend.fortune.service.FortuneService;
import com.recharge.backend.fortune.vo.FortuneRequestVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class FortuneController {

    @Autowired
    private FortuneService fortuneService;

    @PostMapping("/getFortune")
    public ResponseEntity<?> getFortune(@RequestBody FortuneRequestVO requestVO) {

        try {
            String fortuneResult = fortuneService.getFortune(requestVO);

            return ResponseEntity.ok(Map.of("fortune", fortuneResult));

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("err", e.getMessage()));
        }
    }
}