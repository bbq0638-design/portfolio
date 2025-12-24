package com.recharge.backend.community.nav.controller;

import com.recharge.backend.community.nav.service.NavService;
import com.recharge.backend.community.nav.vo.NavVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/community/{id}/nav")
@CrossOrigin(origins = "http://localhost:3000")
public class NavController {

    @Autowired
    private NavService navService;

    @GetMapping
    public NavResponse getNavigation(@PathVariable("id") Long communityPostId) {
        NavVO previousPost = navService.getPreviousPost(communityPostId);
        NavVO nextPost = navService.getNextPost(communityPostId);

        return new NavResponse(previousPost, nextPost);
    }

    public static class NavResponse {
        private NavVO prevPost;
        private NavVO nextPost;

        public NavResponse(NavVO prevPost, NavVO nextPost) {
            this.prevPost = prevPost;
            this.nextPost = nextPost;
        }

        public NavVO getPrevPost() {
            return prevPost;
        }

        public NavVO getNextPost() {
            return nextPost;
        }
    }
}