import React,{useState} from "react";
import {useNavigate} from "react-router-dom"
import '../../css/auth/FindPwd.css';
import axios from "axios";

function FindPwd() {
    const[userId, setUserId]=useState('');
    const[userName,setUserName]=useState('');
    const[userEmail,setUserEmail]=useState('');
    const navigate=useNavigate();

    const handleSubmit=async (e) => {
        e.preventDefault();

        if(!userId.trim()||!userName.trim()||!userEmail.trim()){
            alert("모든 정보를 입력해주세요.");
            return;
        }

        try{
            const response = await axios.post("/recharge/api/users/findpwd",
                {id: userId.trim(),
                name: userName.trim(),
                email: userEmail.trim()},
            {withCredentials:true});
            navigate("/findpwd_result");
        } catch(error) {
            console.error("비밀번호 찾기 실패:", error);
            alert("입력하신 정보로 가입된 계정이 없습니다.");
        }
    };

    return(
        <div className="find_pwd_main">
            <div className="find_pwd_header">
                <h1>비밀번호 찾기</h1>
                <p className="find_pwd_subtitle">가입 시 등록한 이메일로 비밀번호를 재설정할 수 있습니다</p>
            </div>
            <form className="find_pwd_form_container"
                    onSubmit={handleSubmit}>
                <div className="find_pwd_radio_group">
                    <label className="find_pwd_radio_option">
                        <input type="radio" name="findMethod" value="email" defaultChecked /> 
                        <span>가입 이메일로 찾기</span>
                    </label>
                </div>
                <div className="find_pwd_form">
                    <div className="find_pwd_form_group">
                        <label className="find_pwd_form_label">아이디</label>
                        <input type="text" placeholder="아이디를 입력하세요" className="find_pwd_input_id"
                                value={userId}
                                onChange={(e)=> setUserId(e.target.value)}/>
                    </div>
                    <div className="find_pwd_form_group">
                        <label className="find_pwd_form_label">이름</label>
                        <input type="text" placeholder="이름을 입력하세요" className="find_pwd_input_name"
                                value={userName}
                                onChange={(e)=>setUserName(e.target.value)}/>
                    </div>
                    <div className="find_pwd_form_group">
                        <label className="find_pwd_form_label">가입 이메일</label>
                        <input type="email" placeholder="이메일을 입력하세요" className="find_pwd_input_email"
                                value={userEmail}
                                onChange={(e)=>setUserEmail(e.target.value)}/>
                    </div>
                </div>
                <button type="submit" className="find_pwd_btn">
                    비밀번호 찾기
                </button>
            </form>
        </div>
    )
}
export default FindPwd;