import React from "react";
import '../../css/auth/SignResult.css';
import {Link, useLocation} from 'react-router-dom'

function SignResult() {

    const location = useLocation();
    const userName= location.state?.userName || "회원";
    return(
        <div className="signresult_main">
            <div className="signresult_header">
                <h1>{userName}님! 환영합니다!</h1>
                <p className="signresult_subtitle">회원가입이 완료되었습니다</p>
            </div>
            <div className="signresult_content">
                <div className="signresult_message">
                    <h3>회원가입이 완료되었습니다.</h3>
                    <h4>Re:charge와 함께 새로운 충전의 시간을 즐겨보세요!</h4>
                </div>
                <div className="signresult_move_action_btn">
                    <button type="button" className="move_recharger_btn">
                        <Link to="/find_charger">충전소 찾으러가기</Link>
                    </button>
                    <button type="button" className="move_movie_btn">
                        <Link to="/find_contents/movie">영화·음악 추천</Link>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SignResult;