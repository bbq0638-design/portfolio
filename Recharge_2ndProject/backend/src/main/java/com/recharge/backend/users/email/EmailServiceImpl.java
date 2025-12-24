package com.recharge.backend.users.email;

import com.recharge.backend.users.dao.UsersDAO;
import com.recharge.backend.users.vo.UsersVO;
import jakarta.mail.Message;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class EmailServiceImpl implements EmailService{

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UsersDAO usersDAO;

    @Override
    public void sendEmail(String to, String subject, String content) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(content);
            message.setFrom("mirke7259@naver.com");
            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace(); // 또는 로그로 출력
        }
    }

    @Override
    public void sendPasswordResetEmail(UsersVO user) {
        String token = UUID.randomUUID().toString();
        String resetLink = "https://localhost:3000/modifypwd?token=" + token;

        usersDAO.saveResetToken(user.getUserId(), token);

        String subject = "비밀번호 재설정 안내";
        String htmlBody = "<h1>안녕하세요" + user.getUserName()+"님,<h1>"
                      + "<p>비밀번호를 재설정하려면 아래 링크를 클릭해주세요<p>"
                      + "<a href=\"" + resetLink + "\" style=\"display:inline-block;padding:10px 20px;background:#007bff;color:#fff;text-decoration:none;border-radius:5px;\">비밀번호 재설정하기</a>";

        try {
            MimeMessage message = mailSender.createMimeMessage();
            message.setSubject(subject, "UTF-8");
            message.setRecipients(Message.RecipientType.TO, user.getUserEmail());
            message.setContent(htmlBody, "text/html; charset=UTF-8");
            message.setFrom("mirke7259@naver.com");

            mailSender.send(message); // ✅ 직접 전송
        } catch (Exception e) {
            e.printStackTrace();
        }
        sendEmail(user.getUserEmail(), subject, htmlBody);
    }

}
