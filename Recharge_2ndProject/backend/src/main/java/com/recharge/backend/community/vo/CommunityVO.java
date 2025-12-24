package com.recharge.backend.community.vo;

import java.util.Date;

public class CommunityVO {

    private Long communityPostId;
    private String userId;
    private String communityImagePath;
    private String communityImageName;
    private String communityTitle;
    private String communityContent;
    private int communityLikeCount;
    private int communityViewCount;
    private Date createDate;
    private String createId;
    private Date updatedDate;
    private String updatedId;
    private String communityTab;

    // 기존 Getter/Setter는 그대로 유지...
    public Long getCommunityPostId() { return communityPostId; }
    public void setCommunityPostId(Long communityPostId) { this.communityPostId = communityPostId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getCommunityImagePath() { return communityImagePath; }
    public void setCommunityImagePath(String communityImagePath) { this.communityImagePath = communityImagePath; }

    public String getCommunityImageName() { return communityImageName; }
    public void setCommunityImageName(String communityImageName) { this.communityImageName = communityImageName; }

    public String getCommunityTitle() { return communityTitle; }
    public void setCommunityTitle(String communityTitle) { this.communityTitle = communityTitle; }

    public String getCommunityContent() { return communityContent; }
    public void setCommunityContent(String communityContent) { this.communityContent = communityContent; }

    public int getCommunityLikeCount() { return communityLikeCount; }
    public void setCommunityLikeCount(int communityLikeCount) { this.communityLikeCount = communityLikeCount; }

    public int getCommunityViewCount() { return communityViewCount; }
    public void setCommunityViewCount(int communityViewCount) { this.communityViewCount = communityViewCount; }

    public Date getCreateDate() { return createDate; }
    public void setCreateDate(Date createDate) { this.createDate = createDate; }

    public String getCreateId() { return createId; }
    public void setCreateId(String createId) { this.createId = createId; }

    public Date getUpdatedDate() { return updatedDate; }
    public void setUpdatedDate(Date updatedDate) { this.updatedDate = updatedDate; }

    public String getUpdatedId() { return updatedId; }
    public void setUpdatedId(String updatedId) { this.updatedId = updatedId; }

    public String getCommunityTab() { return communityTab; }
    public void setCommunityTab(String communityTab) { this.communityTab = communityTab; }

    // 디버깅용 toString() 추가
    @Override
    public String toString() {
        return "CommunityVO{" +
                "communityPostId=" + communityPostId +
                ", userId='" + userId + '\'' +
                ", communityTitle='" + communityTitle + '\'' +
                ", communityTab='" + communityTab + '\'' +
                ", updatedDate=" + updatedDate +
                '}';
    }
}