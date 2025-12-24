package com.recharge.backend.movie.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.ClientRequest;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@Configuration
public class TmdbConfig {

    @Bean
    public WebClient tmdbWebClient(
            @Value("${tmdb.baseUrl}") String baseUrl,
            @Value("${tmdb.apiKey}") String apiKey,
            @Value("${tmdb.lang}") String language,
            @Value("${tmdb.region}") String region
    ) {
        // 모든 요청 URL에 공통 쿼리파라미터 자동 추가
        ExchangeFilterFunction addCommonQueryParams = (request, next) -> {
            URI newUri = UriComponentsBuilder.fromUri(request.url())
                    .queryParam("api_key", apiKey)
                    .queryParam("language", language)
                    .queryParam("region", region)
                    .build(true) // 인코딩 보존
                    .toUri();

            ClientRequest newRequest = ClientRequest.from(request)
                    .url(newUri)
                    .build();

            return next.exchange(newRequest);
        };

        // (선택) 요청/응답 간단 로그
        ExchangeFilterFunction logFilter = (request, next) -> {
            System.out.println("[TMDB] --> " + request.method() + " " + request.url());
            return next.exchange(request).doOnNext(res ->
                    System.out.println("[TMDB] <-- status=" + res.statusCode()));
        };

        return WebClient.builder()
                .baseUrl(baseUrl) // 예: https://api.themoviedb.org/3
                .defaultHeader("Accept", MediaType.APPLICATION_JSON_VALUE)
                .filter(addCommonQueryParams)
                .filter(logFilter) // 필요 없으면 이 라인 제거
                .build();
    }
}
