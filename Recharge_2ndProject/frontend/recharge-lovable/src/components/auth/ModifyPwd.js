import React,{useState, useEffect} from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ModifyPwd(){
    const [newPwd, setNewPwd]=useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [tokenValid, setTokenValid] = useState(true);

    const[searchParams]=useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    useEffect(()=>{
        if(!token){
            setTokenValid(false);
        }
    }, [token]);

    const handleSubmit= async (e) => {
        e.preventDefault();

        if(!newPwd || !confirmPwd) {
            alert("비밀번호를 모두 입력해주세요.");
            return;
        }

        if(newPwd !== confirmPwd) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        
        try{
          const response = await axios.post("/recharge/api/users/modifypwd", {
                token: token.trim(),
                newPwd: newPwd.trim()
            },{
                withCredentials: true
            });
            alert("비밀번호가 성공적으로 변경되었습니다.");
            navigate("/login");
        }catch(error) {
            console.error("비밀번호 변경 실패:", error);
            alert("비밀번호 변경에 실패했습니다. 링크가 만료되었거나 유효하지 않습니다.");
        }
    }
    if (!tokenValid) {
            return (
                <div className="login_main">
                <div className="login_header">
                    <h1>비밀번호 변경</h1>
                    <p className="login_subtitle">잘못된 접근입니다. 이메일 링크를 다시 확인해주세요.</p>
                </div>
                </div>
            );
    }

        return(
            <div className="login_main">
                <div className="login_header">
                    <h1>비밀번호 변경</h1>
                    <p className="login_subtitle">새로운 비밀번호를 설정해주세요</p>
                </div>
                <form className="login_form_container"
                        onSubmit={handleSubmit}>
                    <div className="login_form">
                        <div className="login_form_group">
                            <label className="login_form_label">새로운 비밀번호</label>
                            <input type="password" className="newpwd" placeholder="비밀번호를 입력하세요"
                                    value={newPwd}
                                    onChange={(e)=> setNewPwd(e.target.value)}/>
                        </div>
                        <div className="login_form_group">
                            <label className="login_form_label">새로운 비밀번호 확인</label>
                            <input type="password" className="newpwdconfirm" placeholder="비밀번호를 입력하세요"
                                    value={confirmPwd}
                                    onChange={(e)=> setConfirmPwd(e.target.value)}/>
                        </div>
                        <button type="submit" className="login_btn">비밀번호 변경</button>
                    </div>
                </form>
            </div>
        )
}

export default ModifyPwd;