package com.recharge.backend.community.service;

import com.recharge.backend.community.dao.CommunityDAO;
import com.recharge.backend.community.vo.CommunityVO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class CommunityService {

    @Autowired
    private CommunityDAO communityDAO;

    public List<CommunityVO> getCommunityList() {
        return communityDAO.getCommunityList();
    }

    public CommunityVO getCommunityPost(Long id) {
        return communityDAO.getCommunityPost(id);
    }

    // ✅ 트랜잭션 적용: insert 후 commit
    @Transactional
    public void insertCommunityPost(CommunityVO post) {
        communityDAO.insertCommunityPost(post);
    }

    @Transactional
    public void updateCommunityPost(CommunityVO post) {
        communityDAO.updateCommunityPost(post);
    }

    @Transactional
    public void deleteCommunityPost(Long id) {
        communityDAO.deleteCommunityPost(id);
    }


    // ✅ 게시글 좋아요
    @Transactional
    public void likePost(Long id) {
        communityDAO.incrementLike(id);
    }

    //조회수증가
    @Transactional
    public void increaseViewCount(Long id) {
        System.out.println("조회수 증가 서비스 호출 ID: " + id);
            communityDAO.increaseViewCount(id);
        }

    }

