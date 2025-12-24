package com.recharge.backend.comment.controller;

import com.recharge.backend.comment.dao.CommentDAO;
import com.recharge.backend.comment.vo.CommentVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentDAO commentDAO;

    @GetMapping
    public List<CommentVO> getComments(@RequestParam("targetType") String targetType,
                                       @RequestParam("targetId") Long targetId) {
        return commentDAO.selectComments(targetType, targetId);
    }

    @PostMapping
    public CommentVO addComment(@RequestBody CommentVO comment) {
        commentDAO.insertComment(comment);
        return comment;
    }

    @DeleteMapping("/{commentId}")
    public void deleteComment(@PathVariable("commentId") Long commentId) {
        commentDAO.deleteComment(commentId);
    }
}