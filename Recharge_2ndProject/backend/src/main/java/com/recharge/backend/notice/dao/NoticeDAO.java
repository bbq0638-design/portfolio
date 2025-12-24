package com.recharge.backend.notice.dao;

import com.recharge.backend.notice.vo.NoticeVO;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface NoticeDAO {

    List<NoticeVO> getNoticeList();           // 전체 조회
    NoticeVO getNotice(Long noticeId);        // 단건 조회
    int insertNotice(NoticeVO notice);        // 등록
    int updateNotice(NoticeVO notice);        // 수정
    int deleteNotice(Long noticeId);          // 삭제
}

