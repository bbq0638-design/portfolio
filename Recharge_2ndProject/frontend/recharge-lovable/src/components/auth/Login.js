import React,{useState} from "react";
import {Link, useNavigate} from 'react-router-dom';
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import '../../css/auth/Login.css';

function Login() {
    const{login} = useAuth();
    const [userId, setUserId] = useState('');
    const [userPwd, setUserPwd] = useState('');
    const navigate = useNavigate();
    

    const handleLogin = async (e)=> {
        e.preventDefault();

        if(!userId.trim()|| !userPwd.trim()){
            alert('아이디와 비밀번호를 모두 입력해주세요.');
            return;
        }

        try{
            const response = await axios.post('/recharge/api/users/login',{
                userId,
                userPwd
            }, { withCredentials: true });

            console.log("로그인 성공:", response.data);

            login(userId);


            if (userId === "admin") {
                navigate("/admin/reportmanage");
            } 
            else {
                navigate("/");
            }


        } catch (error) {
            console.log("로그인실패", error);
            alert("아이디 또는 비밀번호가 올바르지 않습니다.");
        }
        
    }
    
    return(
        <div className="login_main">
            <div className="login_header">
                <h1>로그인</h1>
                <p className="login_subtitle">Re:charge에 오신 것을 환영합니다</p>
            </div>
            <form className="login_form_container"
                    onSubmit={handleLogin}>
                <div className="login_form">
                    <div className="login_form_group">
                        <label className="login_form_label">아이디</label>
                        <input type="text" className="userId" placeholder="아이디를 입력하세요"
                                value={userId}
                                onChange={(e)=> setUserId(e.target.value)}/>
                    </div>
                    <div className="login_form_group">
                        <label className="login_form_label">비밀번호</label>
                        <input type="password" className="userpwd" placeholder="비밀번호를 입력하세요"
                                value={userPwd}
                                onChange={(e)=> setUserPwd(e.target.value)}/>
                    </div>
                    <button type="submit" className="login_btn">로그인</button>
                </div>
            </form>
            <div className="find_form">
                <Link to="/findid">아이디</Link>나 <Link to="/findpwd">비밀번호</Link>를 잊으셨나요?
            </div>
            <div className="sign_action_form">
                계정이 없으시다면 <Link to="/agreement">가입하기</Link>
            </div>
        </div>
    )
}

export default Login;