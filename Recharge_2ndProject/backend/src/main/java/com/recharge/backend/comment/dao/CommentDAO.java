package com.recharge.backend.comment.dao;

import com.recharge.backend.comment.vo.CommentVO;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class CommentDAO {
    @Autowired
    private SqlSessionTemplate sqlSession;


    private static final String NAMESPACE = "com.recharge.backend.comment.dao.CommentDAO";

    public List<CommentVO> selectComments(String targetType, Long targetId) {
        Map<String, Object> param = new HashMap<>();
        param.put("targetType", targetType);
        param.put("targetId", targetId);
        return sqlSession.selectList(NAMESPACE + ".selectComments", param);
    }

    public int insertComment(CommentVO comment) {
        return sqlSession.insert(NAMESPACE + ".insertComment", comment);
    }

    public int deleteComment(Long commentId) {
        return sqlSession.delete(NAMESPACE + ".deleteComment", commentId);
    }
}
