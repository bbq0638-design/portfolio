package com.recharge.backend.music.controller;

import com.recharge.backend.music.service.MusicService;
import com.recharge.backend.music.vo.MusicVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/music")
@RequiredArgsConstructor
public class MusicController {

    private final MusicService musicService;

    @GetMapping("/search/itunes")
    public List<MusicVO> searchItunes(@RequestParam String term,
                                      @RequestParam(required = false, defaultValue = "50") int limit) {
        return musicService.searchItunes(term, limit);
    }

    @PostMapping("/save")
    public int saveAll(@RequestBody List<MusicVO> list,
                       @RequestParam(required = false, defaultValue = "system") String actorId) {
        return musicService.saveAll(list, actorId);
    }

    @GetMapping("/search/db")
    public List<MusicVO> searchFromDb(@RequestParam String keyword) {
        return musicService.searchFromDb(keyword);
    }

    @GetMapping("/chart/top-kr")
    public List<MusicVO> topSongsKr() {
        return musicService.fetchTopSongsKr();
    }

    @GetMapping("/chart/db")
    public List<MusicVO> getChartFromDb() {
        return musicService.fetchTopSongsFromDb();
    }

    @PostMapping("/syncChart")
    public String syncChart(@RequestParam(defaultValue = "system") String actorId) {
        List<MusicVO> list = musicService.fetchTopSongsKr();
        int inserted = musicService.saveAll(list, actorId);
        return "✅ Synced " + inserted + " top songs from Apple Music (KR)";
    }
}
