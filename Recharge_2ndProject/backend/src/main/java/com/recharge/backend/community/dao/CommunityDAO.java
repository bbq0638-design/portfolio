package com.recharge.backend.community.dao;

import com.recharge.backend.community.vo.CommunityVO;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface CommunityDAO {

    // 전체 게시글 조회
    List<CommunityVO> getCommunityList();

    // 단일 게시글 조회
    CommunityVO getCommunityPost(Long communityPostId);

    // 게시글 등록
    int insertCommunityPost(CommunityVO post);

    // 게시글 수정
    int updateCommunityPost(CommunityVO post);

    // 게시글 삭제
    int deleteCommunityPost(Long communityPostId);

    // 게시글 좋아요 증가
    int incrementLike(Long communityPostId);

    // 게시글 조회수증가
    int increaseViewCount(Long communityPostId);


}