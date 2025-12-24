import React from "react";
import { Link } from "react-router-dom";

function AuthLogOut(){
return(
    <>
        <li><Link to="/login">로그인</Link></li>
        <li><Link to="/signup">회원가입</Link></li>
    </>
)
}

export default AuthLogOut;