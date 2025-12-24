import React, { useState } from "react";
import '../../css/fortune/Fortune.css';
import axios from 'axios';

function Fortune() {

    const [formData, setFormData] = useState({
        gender: 'male',
        calendarType: 'solar',
        birthdate: '',
        birthTime: 'unknown',
    });

    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const {name, value} = e.target; 
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGetFortune = async () => {
        if (!formData.birthdate) {
     
            setError('생년월일을 입력해주세요.');

            setResult(''); 
            return;
        }
        setIsLoading(true);
        setResult('');
        setError(null);

        try {
            const response = await axios.post('/recharge/api/getFortune', formData);            setResult(response.data.fortune); 
        } catch (err) {
            if (err.response && err.response.data && err.response.data.err) {
                setError(`운세 생성 실패: ${err.response.data.err}`);
            } else if (err.response) {
                setError(`운세 생성 실패: 서버 오류 (코드: ${err.response.status})`);
            } else if (err.request) {
                setError('운세 생성 실패: 서버에 연결할 수 없습니다. 백엔드가 실행 중인지 확인해주세요.');
            } else {
                setError(`운세 생성 실패: ${err.message}`);
            }
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };


    const showResultBox = isLoading || error || result;

    return(
     <div className="fortune_main">
         <div>
             <h2>오늘의 운세</h2>
             <div className="fortune_container">
                 {/* --- 입력 폼 (이전과 동일) --- */}
                 <div className="fortune_content_row1">
                     <div className="fortune_content_row1_box1">
                         <p>성별</p>
                         <select name="gender" value={formData.gender} onChange={handleChange}>
                             <option value="male">남성</option>
                             <option value="female">여성</option>
                         </select>
                     </div>
                     <div className="fortune_content_row1_box2">
                         <p>달력</p>
                         <select name="calendarType" value={formData.calendarType} onChange={handleChange}>
                             <option value="solar">양력</option>
                             <option value="lunar">음력(평달)</option>
                             <option value="lunar_leap">음력(윤달)</option>
                         </select>
                     </div>
                     <div className="fortune_content_row1_box3">
                         <p>태어난 시간</p>
                         <select name="birthTime" value={formData.birthTime} onChange={handleChange}>
                             <option value="unknown">태어난 시간 모름</option>
                             <option value="23:30">23:30 ~ 01:29 (자시 子時)</option>
                             <option value="01:30">01:30 ~ 03:29 (축시 丑時)</option>
                             <option value="03:30">03:30 ~ 05:29 (인시 寅時)</option>
                             <option value="05:30">05:30 ~ 07:29 (묘시 卯時)</option>
                             <option value="07:30">07:30 ~ 09:29 (진시 辰時)</option>
                             <option value="09:30">09:30 ~ 11:29 (사시 巳時)</option>
                             <option value="11:30">11:30 ~ 13:29 (오시 午時)</option>
                             <option value="13:30">13:30 ~ 15:29 (미시 未時)</option>
                             <option value="15:30">15:30 ~ 17:29 (신시 申時)</option>
                             <option value="17:30">17:30 ~ 19:29 (유시 酉時)</option>
                             <option value="19:30">19:30 ~ 21:29 (술시 戌時)</option>
                             <option value="21:30">21:30 ~ 23:29 (해시 亥時)</option>
                         </select>
                    
                     </div>
                 </div>
                 <div className="fortune_content_row2">
                     <p>생년월일</p>
                     <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} />
                 </div>
                 <div className="fortune_content_row3">
                     <button className="fortune_btn" onClick={handleGetFortune} disabled={isLoading}>{isLoading ? '운세 확인중...' : '운세 확인하기'}</button>
                 </div>
             </div>
             

             {showResultBox && (
                <div className="fortune_result">
                    {error && <p>{error}</p>}
                    {isLoading && <p>운세를 불러오고 있습니다...</p>} 
                    {result && !isLoading && (
                        <p style={{ whiteSpace: 'pre-wrap' }}>{result}</p>
                    )}
                </div>
             )}
         </div>

     </div>
    );
}

export default Fortune;