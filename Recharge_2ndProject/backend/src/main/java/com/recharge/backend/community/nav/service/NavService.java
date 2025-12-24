package com.recharge.backend.community.nav.service;

import com.recharge.backend.community.nav.dao.NavDAO;
import com.recharge.backend.community.nav.vo.NavVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NavService {

    @Autowired
    private NavDAO navDAO;

    public NavVO getPreviousPost(Long communityPostId) {
        return navDAO.getPreviousPost(communityPostId);
    }

    public NavVO getNextPost(Long communityPostId) {
        return navDAO.getNextPost(communityPostId);
    }
}