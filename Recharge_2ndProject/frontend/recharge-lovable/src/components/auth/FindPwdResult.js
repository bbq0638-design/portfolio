import React from "react";
import '../../css/auth/FindPwdResult.css';
import {Link} from 'react-router-dom'

function FindPwdResult() {

    return(
        <div className="find_pwd_result_main">
            <div className="find_pwd_result_header">
                <h1>비밀번호 찾기</h1>
                <p className="find_pwd_result_subtitle">비밀번호 찾기 결과</p>
            </div>
            <div className="find_pwd_result_content">
                <div className="find_pwd_result_message">
                    <h3>임시 비밀번호를 가입된 이메일로 발송했습니다.</h3>
                    <h4>이메일을 확인해주세요.</h4>
                </div>
                <div className="find_pwd_result_btn">
                    <button type="button" className="move_login_btn">
                        <Link to="/login">로그인 하러가기</Link>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FindPwdResult;