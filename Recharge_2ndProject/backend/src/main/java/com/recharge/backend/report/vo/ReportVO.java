package com.recharge.backend.report.vo;

import java.util.Date;

public class ReportVO {
    private int reportId;
    private String reportTargetType;
    private int reportTargetId;
    private String userId;
    private String reportReason;
    private Date reportDate;
    private String reportStatus;
    private Date createDate;
    private String createId;
    private Date updatedDate;
    private String updatedId;


    public int getReportId() {
        return reportId;
    }

    public void setReportId(int reportId) {
        this.reportId = reportId;
    }

    public String getReportTargetType() {
        return reportTargetType;
    }

    public void setReportTargetType(String reportTargetType) {
        this.reportTargetType = reportTargetType;
    }

    public int getReportTargetId() {
        return reportTargetId;
    }

    public void setReportTargetId(int reportTargetId) {
        this.reportTargetId = reportTargetId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getReportReason() {
        return reportReason;
    }

    public void setReportReason(String reportReason) {
        this.reportReason = reportReason;
    }

    public Date getReportDate() {
        return reportDate;
    }

    public void setReportDate(Date reportDate) {
        this.reportDate = reportDate;
    }

    public String getReportStatus() {
        return reportStatus;
    }

    public void setReportStatus(String reportStatus) {
        this.reportStatus = reportStatus;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public String getCreateId() {
        return createId;
    }

    public void setCreateId(String createId) {
        this.createId = createId;
    }

    public Date getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(Date updatedDate) {
        this.updatedDate = updatedDate;
    }

    public String getUpdatedId() {
        return updatedId;
    }

    public void setUpdatedId(String updatedId) {
        this.updatedId = updatedId;
    }
}
