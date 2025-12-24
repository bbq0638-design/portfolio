import React, {useState,useEffect} from "react";
import '../../css/layout/Header.css';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import AuthLogIn from "./AuthLogIn";
import { useAuth } from "../../context/AuthContext";


function Header() {

    const {isLogin, userId, isLoading, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout=()=>{
        logout(navigate);
    }

    const handleProtectedRoute = (path) => {
        if (!isLogin && !isLoading) {
            alert("로그인이 필요합니다.");
            navigate("/login");
        } else {
            navigate(path);
        }
    };

    return(
        <div className="nav_container">
            <div>
                <Link className="nav_logo"to="/">
                    <img className="logo" src="/image/logo.png" alt="logo"/>
                </Link>
            </div>
            <nav className="header_nav">
                <ul className="content_nav">
                    <li> <span onClick={()=>handleProtectedRoute("/find_charger")}>충전소 찾기</span></li>
                    <li> <span onClick={()=>handleProtectedRoute("/find_contents/movie")}>영화·음악 추천</span></li>
                    <li> <span onClick={()=>handleProtectedRoute("/fortune")}>운세</span></li>
                    <Link to="/community">자유게시판</Link>
                    <Link to="/notice">공지사항</Link>
                </ul>
            </nav>
                <ul className="auth_nav">
                        {isLoading ? null : isLogin ? (
                            <AuthLogIn userId={userId} onLogout={handleLogout} /> 
                        ) : (
                                <>
                                    <li><Link to="/login">로그인</Link></li>
                                    <li><Link to="/agreement">회원가입</Link></li>
                                </>
                            )}
                </ul>
        </div>
    )
}

export default Header