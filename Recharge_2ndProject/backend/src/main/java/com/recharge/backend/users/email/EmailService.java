package com.recharge.backend.users.email;

import com.recharge.backend.users.vo.UsersVO;

public interface EmailService {
    void sendEmail(String to, String subject, String content);

    void sendPasswordResetEmail(UsersVO user);
}
