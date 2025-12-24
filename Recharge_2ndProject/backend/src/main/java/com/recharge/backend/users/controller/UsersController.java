package com.recharge.backend.users.controller;

import com.recharge.backend.users.email.EmailService;
import com.recharge.backend.users.service.UsersService;
import com.recharge.backend.users.vo.UsersVO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    @Autowired
    private UsersService usersService;
    @Autowired
    private EmailService emailService;

    @GetMapping("/check-id")
    public ResponseEntity<Boolean> checkUserId(@RequestParam String userId) {
        System.out.println("✅ 중복확인 요청 들어옴: " + userId);
        boolean isDuplicate = usersService.isUserIdDuplicate(userId);
        return ResponseEntity.ok(isDuplicate);
    }

    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkUserEmail(@RequestParam String userEmail) {
        System.out.println("✅ 중복확인 요청 들어옴: " + userEmail);
        boolean isDuplicate = usersService.isUserEmailDuplicate(userEmail);
        return ResponseEntity.ok(isDuplicate);
    }

    @PostMapping("/signup")
    public ResponseEntity<String> registerUser(@RequestBody UsersVO user) {
        usersService.registerUser(user);
        return ResponseEntity.ok("회원가입이 완료되었습니다.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData, HttpServletRequest request) {
        String userId = loginData.get("userId");
        String userPwd = loginData.get("userPwd");
        System.out.println("✅ 로그인확인 요청 들어옴: " + userId+userPwd);
        if(userId== null||userPwd==null || userId.trim().isEmpty() || userPwd.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("아이디와 비밀번호를 입력해주세요.");
        }

        UsersVO user = usersService.login(userId, userPwd);

        if(user!=null) {
            HttpSession session = request.getSession();
            session.setAttribute("loginUser", user.getUserId());
            return ResponseEntity.ok("로그인 성공");
        }else{
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("아이디 또는 비밀번호가 올바르지 않습니다.");
        }
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkLogin(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if(session != null && session.getAttribute("loginUser") != null) {
            String userId = (String) session.getAttribute("loginUser");
            Map<String, String> response = new HashMap<>();
            response.put("userId", userId);
            return ResponseEntity.ok(response);
        }else{
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if(session!=null){
            session.invalidate();
        }
        return ResponseEntity.ok("로그아웃완료");
    }

    @PostMapping("/findid")
    public ResponseEntity<?> findId(@RequestBody Map<String, String> payload) {
        String name=payload.get("name");
        String email=payload.get("email");

        UsersVO user = usersService.findUserByNameAndEmail(name, email);

        if(user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("가입된 정보가 없습니다.");
        }

        try {
            emailService.sendEmail(
                    email,
                    "아이디 찾기 안내",
                    "회원님의 아이디는 ["+ user.getUserId()+"] 입니다."
            );
            return ResponseEntity.ok().build();
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이메일 전송 실패");
        }
    }

    @PostMapping("/findpwd")
    public ResponseEntity<?> findPassword(@RequestBody Map<String, String> payload){
        String id = payload.get("id");
        String name = payload.get("name");
        String email = payload.get("email");

        UsersVO user = usersService.findUserByIdNameEmail(id, name, email);

        if(user == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("가입된 정보가 없습니다.");
        }

        try{
            emailService.sendPasswordResetEmail(user);
            return ResponseEntity.ok().build();
        }catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이메일 전송에 실패하였습니다.");
        }
    }

    @PostMapping("/modifypwd")
    public ResponseEntity<?> modifyPwd(@RequestBody Map<String, String> payload){
        String token = payload.get("token");
        String pwd = payload.get("newPwd");

        UsersVO user = usersService.findUserByResetToken(token);
        if(user== null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("유효하지 않은 토큰입니다.");
        }

        usersService.updatePasswordByToken(token, pwd);
        return ResponseEntity.ok("비밀번호가 변경되었습니다.");
    }

    @GetMapping("/details")
    public ResponseEntity<?> getUserDetails(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("loginUser") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        String userId = (String) session.getAttribute("loginUser");
        UsersVO userDetails = usersService.getUserDetails(userId);

        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자 정보를 찾을 수 없습니다.");
        }


        userDetails.setUserPwd(null);
        return ResponseEntity.ok(userDetails);
    }


    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody UsersVO userUpdateData, HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("loginUser") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        String sessionUserId = (String) session.getAttribute("loginUser");


        userUpdateData.setUserId(sessionUserId);

        try {
            UsersVO updatedUser = usersService.updateUser(userUpdateData);


            updatedUser.setUserPwd(null);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("정보 업데이트에 실패했습니다.");
        }
    }

}
