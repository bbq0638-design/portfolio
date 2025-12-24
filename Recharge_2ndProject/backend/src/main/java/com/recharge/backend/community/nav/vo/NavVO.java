package com.recharge.backend.community.nav.vo;

public class NavVO {

    private Long communityPostId;
    private String communityTitle;

    // 기본 생성자
    public NavVO() {}

    // 매개변수 생성자
    public NavVO(Long communityPostId, String communityTitle) {
        this.communityPostId = communityPostId;
        this.communityTitle = communityTitle;
    }

    // Getter 및 Setter
    public Long getCommunityPostId() {
        return communityPostId;
    }

    public void setCommunityPostId(Long communityPostId) {
        this.communityPostId = communityPostId;
    }

    public String getCommunityTitle() {
        return communityTitle;
    }

    public void setCommunityTitle(String communityTitle) {
        this.communityTitle = communityTitle;
    }

    @Override
    public String toString() {
        return "NavVO{" +
                "communityPostId=" + communityPostId +
                ", communityTitle='" + communityTitle + '\'' +
                '}';
    }
}


