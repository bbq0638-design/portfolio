package com.recharge.backend.users.service;

import com.recharge.backend.users.vo.UsersVO;

public interface UsersService {

    boolean isUserIdDuplicate(String userId);

    boolean isUserEmailDuplicate(String userId);

    void registerUser(UsersVO user);

    UsersVO login(String userId, String userPwd);

    UsersVO findUserByNameAndEmail (String name, String email);

    UsersVO findUserByIdNameEmail(String id, String name, String email);

    void saveResetToken(String usreId, String token);

    UsersVO findUserByResetToken(String token);

    void updatePasswordByToken(String token, String pwd);
    UsersVO getUserDetails(String userId);
    UsersVO updateUser(UsersVO user);
}
