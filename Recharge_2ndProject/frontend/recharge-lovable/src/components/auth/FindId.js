
import React,{useState} from "react";
import {Link, useNavigate} from "react-router-dom"
import axios from "axios";
import '../../css/auth/FindId.css';

function FindId() {
    const [name, setName] = useState('');
    const [email,setEmail] = useState('');
    const navigate = useNavigate();

    const handleFindId = async (e) => {
        e.preventDefault();

        if(!name.trim() || !email.trim()){
            alert("이름과 이메일을 모두 입력해주세요.");
            return;
        }

        try{
            const response = await axios.post("/recharge/api/users/findid", {
                name,
                email
            });
            navigate("/findid_result");
        } catch (error) {
            console.error("아이디 찾기 실패:", error);
            alert("입력하신 정보로 가입된 아이디가 없습니다.");
        }
    };

    return(
        <div className="find_id_main">
            <div className="find_id_header">
                <h1>아이디 찾기</h1>
                <p className="find_id_subtitle">가입 시 등록한 이메일로 아이디를 찾을 수 있습니다</p>
            </div>
            <form className="find_id_form_container" onSubmit={handleFindId}>
                <div className="find_id_radio_group">
                    <label className="find_id_radio_option">
                        <input type="radio" name="findMethod" value="email" defaultChecked /> 
                        <span>가입 이메일로 찾기</span>
                    </label>
                </div>
                <div className="find_id_form">
                    <div className="find_id_form_group">
                        <label className="find_id_form_label">이름</label>
                        <input type="text" placeholder="이름을 입력하세요" className="find_id_input_name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}/>
                    </div>
                    <div className="find_id_form_group">
                        <label className="find_id_form_label">가입 이메일</label>
                        <input type="email" placeholder="이메일을 입력하세요" className="find_id_input_email"
                                value={email}
                                onChange={(e)=> setEmail(e.target.value)}/>
                    </div>
                </div>
                <button type="submit" className="find_id_btn">
                    아이디 찾기
                </button>
            </form>
        </div>
    )
}
export default FindId;
