import React,{useState} from "react";
import { Link } from "react-router-dom";
import "../../css/layout/AuthLogIn.css";

function AuthLogIn({onLogout, userId}){
    const[menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(prev=> !prev);

    return(
        <div className="user_menu_container">
            <span className="user_name">{userId}님</span>
            <button className="hamburger_btn" onClick={toggleMenu}>
                ☰
            </button>

            {menuOpen &&(
                <ul className="user_dropdown">
                    <li><Link to="/mypage">마이페이지</Link></li>
                    <li><Link to="/bookmark">즐겨찾기</Link></li>
                    <li><button onClick={onLogout}>로그아웃하기</button></li>
                </ul>
            )}
        </div>
    )
}
export default AuthLogIn;