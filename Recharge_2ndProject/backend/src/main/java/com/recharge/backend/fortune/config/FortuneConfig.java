package com.recharge.backend.fortune.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class FortuneConfig {

    @Bean(name = "fortuneWebClient")
    public WebClient fortuneWebClient() {
        return WebClient.builder().build();
    }
}
