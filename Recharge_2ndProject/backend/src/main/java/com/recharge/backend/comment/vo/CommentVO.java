package com.recharge.backend.comment.vo;
import java.util.Date;

public class CommentVO {
    private Long commentId;
    private String commentTargetType;
    private Long commentTargetId;
    private String userId;
    private String commentContent;
    private Date createDate;
    private String createId;
    private Date updatedDate;
    private String updatedId;

    public Long getCommentId() {
        return commentId;
    }

    public void setCommentId(Long commentId) {
        this.commentId = commentId;
    }

    public String getCommentTargetType() {
        return commentTargetType;
    }

    public void setCommentTargetType(String commentTargetType) {
        this.commentTargetType = commentTargetType;
    }

    public Long getCommentTargetId() {
        return commentTargetId;
    }

    public void setCommentTargetId(Long commentTargetId) {
        this.commentTargetId = commentTargetId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getCommentContent() {
        return commentContent;
    }

    public void setCommentContent(String commentContent) {
        this.commentContent = commentContent;
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



