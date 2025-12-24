package com.recharge.backend.report.controller;

import com.recharge.backend.report.dao.ReportDAO;
import com.recharge.backend.report.service.ReportService;
import com.recharge.backend.report.vo.ReportVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/report")
public class ReportController {


    @Autowired
        private ReportService reportService;

      //신고 접수
        @PostMapping
        public ResponseEntity<String> submitReport(@RequestBody ReportVO report) {
            reportService.submitReport(report);
            return ResponseEntity.ok("신고 완료 - reportId: " + report.getReportId());
        }


        //관리자용 신고 목록 조회

        @GetMapping("/admin/Reportlist")
       public ResponseEntity<List<ReportVO>> getAllReports() {
            List<ReportVO> reports = reportService.getAllReports();
            return ResponseEntity.ok(reports);

        }

        //관리자 신고 처리 (삭제 or 해제)

       @PutMapping("/admin/ReportUpdate")
       public ResponseEntity<String> updateReportStatus(@RequestBody ReportVO report) {
            reportService.updateReportStatus(report);
            return ResponseEntity.ok("신고 상태가 ["+ report.getReportStatus()+"]로 변경되었습니다");
       }



    }





