package com.recharge.backend.users.dao;

import com.recharge.backend.users.vo.UsersVO;

public interface UsersDAO {

    int countUserId(String userId);

    int countUserEmail(String userEmail);

    void insertUser(UsersVO user);

    UsersVO findUserById(String userId);

    UsersVO selectUserByNameAndEmail(String name, String email);

    UsersVO selectUserByIdNameEmail(String id, String name, String email);

    void updatePasswordByToken(String token, String newPwd, String userId);

    UsersVO findUserByResetToken(String Token);

    void saveResetToken(String userId, String token);

    void updateUser(UsersVO user);
}
