package com.recharge.backend.community.controller;

import com.recharge.backend.community.service.CommunityService;
import com.recharge.backend.community.vo.CommunityVO;
import com.recharge.backend.community.dao.CommunityDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/community")
@CrossOrigin(origins = "http://localhost:3000") // React 허용
public class CommunityController {

    @Autowired
    private CommunityDAO communityDAO;

    @Autowired
    private CommunityService communityService;

    // ✅ 전체 게시글 조회
    @GetMapping
    public List<CommunityVO> getAll() {
        return communityDAO.getCommunityList();
    }

    // ✅ 단일 게시글 조회
    @GetMapping("/{id}")
    public CommunityVO get(@PathVariable("id") Long id) {
        return communityDAO.getCommunityPost(id);
    }

    // ✅ 게시글 등록
    @PostMapping
    public String insert(
            @RequestParam("userId") String userId,
            @RequestParam("communityTitle") String communityTitle,
            @RequestParam("communityContent") String communityContent,
            @RequestParam("communityTab") String communityTab,
            @RequestParam(value = "communityImage", required = false) MultipartFile communityImage
    ) {
        CommunityVO post = new CommunityVO();
        post.setUserId(userId);
        post.setCommunityTitle(communityTitle);
        post.setCommunityContent(communityContent);
        post.setCommunityTab(communityTab);
        post.setCreateId(userId);
        post.setUpdatedId(userId);

        if (communityImage != null && !communityImage.isEmpty()) {
            try {

                String uploadDir = "C:/upload/";
                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();

                String filename = System.currentTimeMillis() + "_" + communityImage.getOriginalFilename();
                String filePath = uploadDir +filename;
                communityImage.transferTo(new File(filePath));

                // DB에는 상대 URL로 저장 (React에서 접근 가능)
                post.setCommunityImagePath("/upload/" + filename);
                post.setCommunityImageName(filename);

            } catch (Exception e) {
                e.printStackTrace();
                return "이미지 업로드 실패";
            }
        }

       try {

           communityService.insertCommunityPost(post);
       } catch (Exception e) {
           e.printStackTrace();
           return "게시글 등록 실패 : " + e.getMessage();
       }
       return "success";
    }

    // ✅ 게시글 수정
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(
            @PathVariable("id") Long id,
            @RequestParam("userId") String userId,
            @RequestParam("communityTitle") String communityTitle,
            @RequestParam("communityContent") String communityContent,
            @RequestParam("communityTab") String communityTab,
            @RequestParam(value = "communityImage", required = false) MultipartFile communityImage,
            @RequestParam(value = "deleteImage", required = false, defaultValue = "false") boolean deleteImage
    ) {
        Map<String, Object> response = new HashMap<>();

        try {
            // 기존 게시글 조회
            CommunityVO existingPost = communityDAO.getCommunityPost(id);

            if (existingPost == null) {
                response.put("success", false);
                response.put("message", "게시글을 찾을 수 없습니다.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            // 권한 검증 (작성자 본인 또는 관리자만 수정 가능)
            if (!existingPost.getUserId().equals(userId) && !"admin".equals(userId)) {
                response.put("success", false);
                response.put("message", "수정 권한이 없습니다.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }

            // 수정할 데이터 설정
            CommunityVO post = new CommunityVO();
            post.setCommunityPostId(id);
            post.setCommunityTitle(communityTitle);
            post.setCommunityContent(communityContent);
            post.setCommunityTab(communityTab);
            post.setUpdatedId(userId);

            // 이미지 처리
            if (deleteImage) {
                // 이미지 삭제 요청
                post.setCommunityImagePath(null);
                post.setCommunityImageName(null);

                // 기존 파일 삭제
                if (existingPost.getCommunityImagePath() != null) {
                    String oldFilePath = "C:/upload/" + existingPost.getCommunityImageName();
                    File oldFile = new File(oldFilePath);
                    if (oldFile.exists()) {
                        oldFile.delete();
                    }
                }
            } else if (communityImage != null && !communityImage.isEmpty()) {
                // 새 이미지 업로드
                try {
                    String uploadDir = "C:/upload/";
                    File dir = new File(uploadDir);
                    if (!dir.exists()) dir.mkdirs();

                    String filename = System.currentTimeMillis() + "_" + communityImage.getOriginalFilename();
                    String filePath = uploadDir + filename;
                    communityImage.transferTo(new File(filePath));

                    post.setCommunityImagePath("/upload/" + filename);
                    post.setCommunityImageName(filename);

                    // 기존 이미지 파일 삭제
                    if (existingPost.getCommunityImagePath() != null) {
                        String oldFilePath = "C:/upload/" + existingPost.getCommunityImageName();
                        File oldFile = new File(oldFilePath);
                        if (oldFile.exists()) {
                            oldFile.delete();
                        }
                    }

                } catch (Exception e) {
                    e.printStackTrace();
                    response.put("success", false);
                    response.put("message", "이미지 업로드 실패");
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
                }
            }
            // 이미지를 변경하지 않는 경우 null로 설정 (MyBatis에서 기존 값 유지)

            // 게시글 수정
            communityService.updateCommunityPost(post);

            response.put("success", true);
            response.put("message", "게시글 수정 성공");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "게시글 수정 실패: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    // ✅ 게시글 삭제
    @DeleteMapping("/{id}")
    public String delete(@PathVariable("id") Long id) {
        communityDAO.deleteCommunityPost(id);
        return "deleted";
    }

      //좋아요 증가
    @PostMapping("/{id}/like")
    public ResponseEntity<String> likePost(@PathVariable Long id) {
        communityService.likePost(id);
        return ResponseEntity.ok("좋아요 완료");
    }


    // 조회수 증가
    @PostMapping("/{id}/view")
    public ResponseEntity<String> increaseViewCount(@PathVariable Long id) {
        System.out.println("조회수 증가 요청 ID: " + id);
        try {
            communityService.increaseViewCount(id);
            return ResponseEntity.ok("조회수 증가 완료");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("조회수 증가 실패");
        }
    }

}
