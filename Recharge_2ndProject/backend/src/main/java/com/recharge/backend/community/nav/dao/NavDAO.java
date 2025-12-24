package com.recharge.backend.community.nav.dao;

import com.recharge.backend.community.nav.vo.NavVO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface NavDAO {
    NavVO getPreviousPost(Long communityPostId);
    NavVO getNextPost(Long communityPostId);
}