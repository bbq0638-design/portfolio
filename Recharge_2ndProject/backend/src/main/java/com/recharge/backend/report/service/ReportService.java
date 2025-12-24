package com.recharge.backend.report.service;


import com.recharge.backend.report.dao.ReportDAO;
import com.recharge.backend.report.vo.ReportVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService {

    @Autowired
    private ReportDAO reportDAO;

    public void submitReport(ReportVO report) {
        // 1. 현재 최대 reportId 조회
        int maxId = reportDAO.getMaxReportId();

        // 2. 다음 ID 계산
        int nextId = maxId + 1;

        // 3. Report 객체에 ID 설정
        report.setReportId(nextId);

        // 4. DB에 삽입
        reportDAO.insertReport(report);
    }

    public List<ReportVO> getAllReports() {
        return reportDAO.getAllReports();
    }

    public void updateReportStatus(ReportVO report) {
        reportDAO.updateReportStatus(report);
    }
}
