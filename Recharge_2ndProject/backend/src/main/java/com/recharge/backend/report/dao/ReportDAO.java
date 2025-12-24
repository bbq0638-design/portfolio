package com.recharge.backend.report.dao;
import com.recharge.backend.report.vo.ReportVO;
import org.apache.ibatis.annotations.Mapper;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Repository
public class ReportDAO {
    @Autowired
    private SqlSessionTemplate sqlSession;

    public int insertReport(ReportVO report) {
        return sqlSession.insert("com.recharge.backend.report.dao.ReportDAO.insertReport", report);
    }

    public boolean isReported(String targetType, String targetId, String userId) {
        Map<String, Object> param = new HashMap<>();
        param.put("targetType", targetType);
        param.put("targetId", targetId);
        param.put("userId", userId);
        Integer count = sqlSession.selectOne("com.recharge.backend.report.dao.ReportDAO.isReported", param);
        return count != null && count > 0;    }

    // ✅ 추가: 현재 최대 reportId 조회
    public int getMaxReportId() {
        int maxId = sqlSession.selectOne("com.recharge.backend.report.dao.ReportDAO.getMaxReportId");
        return maxId ;
    }

    public List<ReportVO> getAllReports() {
        return sqlSession.selectList("com.recharge.backend.report.dao.ReportDAO.getAllReports");
    }

    public int updateReportStatus(ReportVO report) {
        return sqlSession.update("com.recharge.backend.report.dao.ReportDAO.updateReportStatus", report);
    }

}
