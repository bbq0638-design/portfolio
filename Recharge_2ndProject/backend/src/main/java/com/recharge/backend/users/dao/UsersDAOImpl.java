package com.recharge.backend.users.dao;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import com.recharge.backend.users.vo.UsersVO;

import java.util.HashMap;
import java.util.Map;

@Repository
public class UsersDAOImpl implements UsersDAO {

    @Autowired
    private SqlSession sqlSession;

    private static final String NAMESPACE ="users.";

    @Override
    public int countUserId(String userId) {
        return sqlSession.selectOne(NAMESPACE + "countUserId", userId);
    }

    @Override
    public int countUserEmail(String userEmail) {
        return sqlSession.selectOne(NAMESPACE + "countUserEmail", userEmail);
    }

    @Override
    public void insertUser(UsersVO user) {
        sqlSession.insert(NAMESPACE + "insertUser", user);
    }

    @Override
    public UsersVO findUserById(String userId){
        Map<String, String> param = new HashMap<>();
        return sqlSession.selectOne(NAMESPACE + "findUserById", userId);
    }

    @Override
    public UsersVO selectUserByNameAndEmail(String name, String email){
        Map<String, String> params = new HashMap<>();
        params.put("name", name);
        params.put("email", email);
        return sqlSession.selectOne(NAMESPACE + "selectUserByNameAndEmail", params);
    }

    @Override
    public UsersVO selectUserByIdNameEmail(String id, String name,String email){
        Map<String, String> params = new HashMap<>();
        params.put("id", id);
        params.put("name", name);
        params.put("email", email);
        return sqlSession.selectOne(NAMESPACE + "selectUserByIdNameEmail", params);
    }

    @Override
    public void updatePasswordByToken(String token, String newPwd, String userId){
        Map<String, String> params = new HashMap<>();
        params.put("token", token);
        params.put("newPwd", newPwd);
        params.put("userId", userId);
        sqlSession.update(NAMESPACE+"updatePasswordByToken", params);
    }

    @Override
    public UsersVO findUserByResetToken(String token){
        return sqlSession.selectOne(NAMESPACE+"findUserByResetToken", token);
    }

    @Override
    public void saveResetToken(String userId, String token){
        Map<String, String> params = new HashMap<>();
        params.put("userId", userId);
        params.put("token", token);
        sqlSession.update(NAMESPACE+"saveResetToken", params);
    }

    @Override
    public void updateUser(UsersVO user) {
        sqlSession.update(NAMESPACE + "updateUser", user);
    }
}
