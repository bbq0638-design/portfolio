package com.recharge.backend;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;

@SpringBootApplication(exclude = {UserDetailsServiceAutoConfiguration.class})
@MapperScan({
        "com.recharge.backend.movie.dao",
        "com.recharge.backend.users.dao",
        "com.recharge.backend.music.dao",
        "com.recharge.backend.station.dao",
        "com.recharge.backend.bookmark.dao",
        "com.recharge.backend.community.dao",
        "com.recharge.backend.community.nav.dao",
        "com.recharge.backend.notice.dao",
        "com.recharge.backend.report.dao",
        "com.recharge.backend.charger.dao",
        "com.recharge.backend.placeImage.dao"
})
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }
}
