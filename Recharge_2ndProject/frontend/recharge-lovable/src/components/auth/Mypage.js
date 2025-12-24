import React, { useState, useEffect } from "react";
import '../../css/auth/Mypage.css';
import axios from "axios";

function Mypage() {
    
    const [formData, setFormData] = useState({
        userId: '', 
        userPwd: '', 
        userEmail: '',
        userName: '',
        userBirth: '',
        userPhone: '',
        userCarmodel: ''
    });

    const [originalData, setOriginalData] = useState(null);
    const [editState, setEditState] = useState({
        userPwd: false, userEmail: false, userName: false,
        userBirth: false, userPhone: false, userCarmodel: false
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false); 
    const [error, setError] = useState(null);

    
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const detailsResponse = await axios.get("/recharge/api/users/details");
                const userData = detailsResponse.data;
                console.log("[Mypage 원본 데이터]", userData);

                if (userData.userBirth) {
                    if (userData.userBirth.includes('T')) {
                        userData.userBirth = userData.userBirth.split('T')[0];
                    } else if (userData.userBirth.includes('/')) {
                        const parts = userData.userBirth.split('/');
                        const year = parseInt(parts[0]) < 70 ? '20' + parts[0] : '19' + parts[0];
                        const month = parts[1].padStart(2, '0'); // 'MM'
                        const day = parts[2].padStart(2, '0');   // 'DD'
                        userData.userBirth = `${year}-${month}-${day}`;
                    }
                }

                if (userData.userPhone === null) {
                    userData.userPhone = '';
                }
                if (userData.userCarmodel === null) {
                    userData.userCarmodel = '';
                }

                const initialData = { ...userData, userPwd: '' };
                setFormData(initialData);
                setOriginalData(initialData); 
                setError(null);
            } catch (err) {
                console.error("데이터 로딩 실패:", err);
                if (err.response && err.response.status === 401) {
                    alert("로그인이 필요합니다.");
                    window.location.href = '/login'; 
                } else {
                    setError("정보를 불러오는 데 실패했습니다.");
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, []); 

    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };


    const handleEditClick = (fieldName) => {
        const activeField = Object.keys(editState).find(key => editState[key] === true);

        if (activeField) {
            if (formData[activeField] !== originalData[activeField]) {
                setFormData(prevData => ({
                    ...prevData,
                    [activeField]: originalData[activeField] 
                }));
            }
        }

        const newEditState = {
            userPwd: false, userEmail: false, userName: false,
            userBirth: false, userPhone: false, userCarmodel: false
        };
        
        if (activeField !== fieldName) {
             newEditState[fieldName] = true; 
        }

        setEditState(newEditState);
    };


    const handleSaveAll = async () => {
        if (isSaving) return; 

        let payload = { ...formData };
        let isRestored = false; 

        if (payload.userName.trim() === '') {
            payload.userName = originalData.userName; 
            isRestored = true;
        }
        if (payload.userEmail.trim() === '') {
            payload.userEmail = originalData.userEmail;
            isRestored = true;
        }
        
        const phoneTrimmed = String(payload.userPhone || '').trim();

        if (phoneTrimmed === '') {
            payload.userPhone = '';
        } else if (phoneTrimmed.length !== 11) {
            alert('휴대전화 번호는 010을 포함한 11자리 숫자만 입력해주세요.');
            return;
        }
        if (payload.userCarmodel === null || String(payload.userCarmodel).trim() === '') {
            payload.userCarmodel = '';
        }

        if (payload.userBirth === null || String(payload.userBirth).trim() === '') {
            payload.userBirth = originalData.userBirth;
            isRestored = true;
        }

        if (isRestored && !editState.userPwd) { 
            alert('일부 빈 항목이 이전 정보로 복구되었습니다.');
        }

        if (editState.userPwd) { 
            if (payload.userPwd.length < 8) { 
                alert('새 비밀번호는 8자 이상으로 설정해주세요.');
                return; // 저장 차단
            }
        }

        try {
            setIsSaving(true); 
            
            const response = await axios.put("/recharge/api/users/update", payload);
            const updatedData = response.data;
            
            if (updatedData.userBirth && updatedData.userBirth.includes('T')) {
                updatedData.userBirth = updatedData.userBirth.split('T')[0]; 
            } else if (updatedData.userBirth && updatedData.userBirth.includes('/')) {
                const parts = updatedData.userBirth.split('/');
                const year = parseInt(parts[0]) < 70 ? '20' + parts[0] : '19' + parts[0];
                const month = parts[1].padStart(2, '0');
                const day = parts[2].padStart(2, '0');
                updatedData.userBirth = `${year}-${month}-${day}`;
            }
            if (updatedData.userPhone === null) updatedData.userPhone = '';
            if (updatedData.userCarmodel === null) updatedData.userCarmodeml = '';

            const newOriginalData = { ...updatedData, userPwd: '' }; 
            setOriginalData(newOriginalData); 
            setFormData(newOriginalData); 

            alert('정보가 성공적으로 저장되었습니다.');

            setEditState({
                userPwd: false, userEmail: false, userName: false,
                userBirth: false, userPhone: false, userCarmodel: false
            });

        } catch (err) {
            console.error("정보 저장 실패:", err);
            alert("정보 저장에 실패했습니다.");
        } finally {
            setIsSaving(false); 
        }
    };

    const handleCancel = () => {
        setFormData(originalData); 
        setEditState({ 
            userPwd: false, userEmail: false, userName: false,
            userBirth: false, userPhone: false, userCarmodel: false
        });
    };

    if (isLoading) {
        return <main className="mypage_main"><div><h2>회원 정보 관리</h2><p>로딩 중...</p></div></main>;
    }
    if (error) {
        return <main className="mypage_main"><div><h2>회원 정보 관리</h2><p>{error}</p></div></main>;
    }

    
    return (
        <main className="mypage_main">
            <div className="mypage_h2">
                <h2>회원 정보 관리</h2>
                <div className="mypage_container">
                    
                    <div className="mypage_row1">
                        <p>아이디</p>
                        <div className="mypage_id">{formData.userId}</div>
                    </div>
                    
                 
                    <div className="mypage_row2">
                        <p>비밀번호</p>
                        <div className="mypage_input_row">
                            <input type="password" name="userPwd" placeholder="새 비밀번호를 입력하세요"
                                value={formData.userPwd} onChange={handleChange} disabled={!editState.userPwd} />
                      
                            <div className="mypage_button_wrapper">
                                {editState.userPwd ? (
                                    <>
                                        <button onClick={handleSaveAll} disabled={isSaving}>
                                            {isSaving ? '저장중...' : '저장'}
                                        </button>
                                        <button onClick={handleCancel} disabled={isSaving}>
                                            취소
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => handleEditClick('userPwd')}>수정</button>
                                )}
                            </div>
                        </div>
                    </div>
                    
              
                    <div className="mypage_row3">
                        <p>이메일 주소</p>
                        <div className="mypage_input_row">
                            <input type="email" name="userEmail" value={formData.userEmail}
                                onChange={handleChange}
                                disabled={!editState.userEmail} />
                        
                            <div className="mypage_button_wrapper">
                                {editState.userEmail ? (
                                    <>
                                        <button onClick={handleSaveAll} disabled={isSaving}>
                                            {isSaving ? '저장중...' : '저장'}
                                        </button>
                                        <button onClick={handleCancel} disabled={isSaving}>
                                            취소
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => handleEditClick('userEmail')}>수정</button>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="mypage_row4">
                        <p>이름</p>
                            <div className="mypage_input_row">
                            <input type="text" name="userName" value={formData.userName}
                            onChange={handleChange} disabled={!editState.userName} />
                        
                            <div className="mypage_button_wrapper">
                                {editState.userName ? (
                                <>
                                    <button onClick={handleSaveAll} disabled={isSaving}>
                                        {isSaving ? '저장중...' : '저장'}
                                    </button>
                                    <button onClick={handleCancel} disabled={isSaving}>
                                        취소
                                    </button>
                                </>
                                ) : (
                                <button onClick={() => handleEditClick('userName')}>수정</button>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="mypage_row5">
                        <p>생년월일</p>
                        <div className="mypage_input_row">
                        <input type="date" name="userBirth" value={formData.userBirth}
                            onChange={handleChange} disabled={!editState.userBirth} />
                        
                            <div className="mypage_button_wrapper">
                                {editState.userBirth ? (
                                    <>
                                        <button onClick={handleSaveAll} disabled={isSaving}>
                                            {isSaving ? '저장중...' : '저장'}
                                        </button>
                                        <button onClick={handleCancel} disabled={isSaving}>
                                            취소
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => handleEditClick('userBirth')}>수정</button>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="mypage_row6">
                        <p>휴대전화 번호</p>
                            <div className="mypage_input_row">
                        <input type="tel" name="userPhone" value={formData.userPhone}
                            onChange={handleChange} disabled={!editState.userPhone} 
                            placeholder="- (하이픈) 제외하고 작성"/>
                        
                          
                            <div className="mypage_button_wrapper">
                                {editState.userPhone ? (
                                    <>
                                        <button onClick={handleSaveAll} disabled={isSaving}>
                                            {isSaving ? '저장중...' : '저장'}
                                        </button>
                                        <button onClick={handleCancel} disabled={isSaving}>
                                            취소
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => handleEditClick('userPhone')}>수정</button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mypage_row7"> 
                        <p>차종</p>
                            <div className="mypage_input_row">
                        <input type="text" name="userCarmodel" value={formData.userCarmodel}
                            onChange={handleChange} disabled={!editState.userCarmodel} />
                        
                 
                            <div className="mypage_button_wrapper">
                                {editState.userCarmodel ? (
                                    <>
                                        <button onClick={handleSaveAll} disabled={isSaving}>
                                            {isSaving ? '저장중...' : '저장'}
                                        </button>
                                        <button onClick={handleCancel} disabled={isSaving}>
                                            취소
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => handleEditClick('userCarmodel')}>수정</button>
                                )}
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </main>
    );
}

export default Mypage;