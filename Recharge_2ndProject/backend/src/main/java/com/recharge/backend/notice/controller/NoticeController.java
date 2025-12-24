package com.recharge.backend.notice.controller;

import com.recharge.backend.notice.vo.NoticeVO;
import com.recharge.backend.notice.dao.NoticeDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;



@RestController
@RequestMapping("/api/notice")

public class NoticeController {

    @Autowired
    private NoticeDAO noticeDAO;

    // 전체 조회
    @GetMapping
    public List<NoticeVO> getAll() {
        return noticeDAO.getNoticeList();
    }

    // 단건 조회
    @GetMapping("/{id}")
    public NoticeVO get(@PathVariable Long id) {
        return noticeDAO.getNotice(id);
    }

    // 등록
    @PostMapping
    public String insert(@RequestBody NoticeVO notice) {
        noticeDAO.insertNotice(notice);
        return "success";
    }

    // 수정
    @PutMapping("/{id}")
    public String update(@PathVariable Long id, @RequestBody NoticeVO notice) {
        notice.setNoticeId(id);
        noticeDAO.updateNotice(notice);
        return "updated";
    }

    // 삭제
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        noticeDAO.deleteNotice(id);
        return "deleted";
    }
}


