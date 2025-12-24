import React,{useState} from "react";
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import '../../css/auth/SignUp.css';

function SignUp () {

    const [users, setUsers] = useState({
        userId: '',
        userPwd: '',
        userEmail:'',
        userName:'',
        userBirth:'',
        userGender:'',
        userPhone:'',
        userCarmodel:''
        });
    
    const [isDuplicate, setIsDuplicate] = useState(null);
    
    const navigate=useNavigate();
    
    const validateForm = () => {
        const { userId, userPwd, userEmail, userName} = users;

        return(
            userId.trim() !== ''&&
            userPwd.trim() !== ''&&
            userEmail.trim() !== ''&&
            userName.trim() !== ''
        );
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        console.log('회원가입 데이터:', users);

        if(!validateForm()){
            alert('필수 항목을 모두 입력해주세요');
            return;
        }

        if(isDuplicate === null) {
            alert('아이디 중복확인을 해주세요.');
            return;
        }else if(isDuplicate === true) {
            alert('이미 사용중인 아이디입니다.')
            return;
        }

        const genderToSave = users.userGender === 'male' ? 'M' : 'F';

        const payload = {
            ...users, userGender: genderToSave
        };

        try{
            const response = await axios.post('/recharge/api/users/signup', payload,{withCredentials: true});
            console.log('백엔드 응답:', response.data);
            navigate('/signup_result',
                {state: {userName: users.userName}}
            );
        } catch(error){
            console.error('회원가입 실패', error);
            alert('회원가입 중 오류가 발생했습니다.')
        }
    };

    const checkDuplicateId = async () => {

        if(!users.userId.trim()) {
            alert('아이디를 입력해주세요.');
            return;
        }

        try{
            const response = await axios.get('/recharge/api/users/check-id', {
                params: {userId: users.userId},
                withCredentials: true
            });

            setIsDuplicate(response.data);

            if(response.data) {
                alert('이미 사용 중인 아이디입니다.');
            } else {
                alert('사용 가능한 아이디입니다.');
            }
        } catch (error) {
            console.error('중복확인 실패:' , error);
            alert('중복확인 중 오류가 발생했습니다.');
        }
    };

    const checkDuplicateEmail = async () => {

        if(!users.userId.trim()) {
            alert('이메일를 입력해주세요.');
            return;
        }

        try{
            const response = await axios.get('/recharge/api/users/check-email', {
                params: {userEmail: users.userEmail},
                withCredentials: true
            });

            setIsDuplicate(response.data);

            if(response.data) {
                alert('이미 사용 중인 이메일입니다.');
            } else {
                alert('사용 가능한 이메일입니다.');
            }
        } catch (error) {
            console.error('중복확인 실패:' , error);
            alert('중복확인 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="sign_main">
            <div className="sign_header">
                <h1>회원가입</h1>
                <p className="sign_subtitle">Re:charge와 함께 시작하세요</p>
            </div>
            <form className="sign_form_container"
                onSubmit={handleSubmit}>

               <div className="sign_form">
                    <div className="signup_form_group">
                        <label className="signup_form_label"><span>*</span> 아이디</label>
                        <div className="signup_id_form">
                            <input type="text" placeholder="아이디를 입력하세요" className="signup_id_input"
                                    value={users.userId}
                                    onChange={(e)=> setUsers({...users, userId: e.target.value})} />
                            <button type="button" className="signup_id_check_btn"
                                    onClick={checkDuplicateId}>중복확인</button>
                        </div>
                    </div>
                    
                    <div className="signup_form_group">
                        <label className="signup_form_label"><span>*</span> 비밀번호</label>
                        <input type="password" placeholder="비밀번호를 입력하세요" className="signup_pwd"
                                value={users.userPwd}
                                onChange={(e)=> setUsers({...users, userPwd: e.target.value})} />
                    </div>
                    
                    <div className="signup_form_group">
                        <label className="signup_form_label"><span>*</span> 이메일</label>
                        <div className="signup_id_form">
                            <input type="email" placeholder="이메일을 입력하세요 (아이디/비밀번호 찾기 본인 확인용)" className="signup_email"
                                    value={users.userEmail}
                                    onChange={(e)=> setUsers({...users, userEmail: e.target.value})} />
                                    <button type="button" className="signup_id_check_btn"
                                            onClick={checkDuplicateEmail}
                                        >중복확인</button>
                        </div>
                    </div>
                    
                    <div className="signup_form_group">
                        <label className="signup_form_label"><span>*</span> 이름</label>
                        <input type="text" placeholder="이름을 입력하세요" className="signup_name"
                                value={users.userName}
                                onChange={(e)=> setUsers({...users, userName: e.target.value})} />
                    </div>
                    
                    <div className="signup_form_group">
                        <label className="signup_form_label">생년월일</label>
                        <input type="text" placeholder="생년월일 8자리 (예: 19900101)" className="signup_birth"
                                value={users.userBirth}
                                onChange={(e)=>{
                                    const onlyNums = e.target.value.replace(/[^0-9]/g, '').slice(0,8);
                                    setUsers({...users, userBirth: onlyNums});
                                }} />
                    </div>
                    
                    <div className="signup_form_group">
                        <label className="signup_form_label">성별</label>
                        <div className="signup_gender_form">
                            <label className="gender_option">
                                <input type="radio" name="gender" value="male"
                                        checked={users.userGender === 'male'}
                                        onChange={(e)=> setUsers({...users, userGender: e.target.value})} /> 
                                <span>남자</span>
                            </label>
                            <label className="gender_option">
                                <input type="radio" name="gender" value="female"
                                        checked={users.userGender ==='female'}
                                        onChange={(e)=> setUsers({...users, userGender: e.target.value})} /> 
                                <span>여자</span>
                            </label>
                        </div>
                    </div>
                    
                    <div className="signup_form_group">
                        <label className="signup_form_label">전화번호</label>
                        <div className="signup_phone_form">
                            <select className="singup_select_sdi_code"
                                    value={users.userPhone.slice(0,3)}
                                    onChange={(e) =>{
                                        const rest = users.userPhone.slice(3);
                                        setUsers({...users, userPhone: `${e.target.value}${rest}`});
                                    }}>
                                <option>010</option>
                                <option>011</option>
                                <option>016</option>
                                <option>017</option>
                                <option>019</option>
                            </select>
                            <input type="text" placeholder="전화번호를 입력하세요(-제외)" className="singup_phone_input"
                                    value={users.userPhone.slice(3)}
                                    onChange={(e)=>{
                                        const onlyNums = e.target.value.replace(/[^0-9]/g, '').slice(0,8);
                                        const front = users.userPhone.slice(0,3) || '010';
                                        setUsers({...users, userPhone:`${front}${onlyNums}`});
                                    }} />
                        </div>
                    </div>
                    
                    <div className="signup_form_group">
                        <label className="signup_form_label">차종</label>
                        <input type="text" placeholder="차종을 입력하세요" className="singup_vehicle_input"
                                value={users.userCarmodel}
                                onChange={(e)=>setUsers({...users, userCarmodel: e.target.value})} />
                    </div>
               </div>
               <button type="submit" className="signup_btn">
                회원가입
               </button>
            </form>
        </div>
    )
}

export default SignUp;