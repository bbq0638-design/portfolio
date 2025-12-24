import React, {useRef, useState, useEffect} from "react";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import {useAuth} from '../../context/AuthContext';
import '../../css/findcharger/FindChargerLogout.css';

function FindChargerLogout(){
    const [isSlide, setIsSlide] = useState(false);
    const {isLogin, isLoading} = useAuth();

    const navigate = useNavigate();
    const mapRef = useRef(null);

    const handleSlide = ()=>{
        setIsSlide(!isSlide);
    }

    const handleProtectedRoute = (path) => {
        if (!isLogin && !isLoading) {
            alert("로그인이 필요합니다.");
            navigate("/login");
        } else {
            navigate(path);
        }
    };

    useEffect(() => {
            if (!window.kakao || !window.kakao.maps) {
                console.log("⚠️ Kakao SDK 아직 준비 안됨");
                return;
            }
    
            console.log("🔥 Kakao SDK 로딩 시작...");
    
            window.kakao.maps.load(() => {
                console.log("🎉 Kakao 지도 로드됨!!!");
    
                const container = mapRef.current;
    
                const map = new window.kakao.maps.Map(container, {
                    center: new window.kakao.maps.LatLng(36.8074, 127.1470),
                    level: 7,
                });
    
                // 📍 내 위치
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((pos) => {
                        const loc = new window.kakao.maps.LatLng(
                            pos.coords.latitude,
                            pos.coords.longitude
                        );
    
                        new window.kakao.maps.Marker({
                            map,
                            position: loc,
                        });
    
                        const circle = new window.kakao.maps.Circle({
                            center: loc,         // 중심 좌표(현재 위치)
                            radius: 5000,                // 반경 (5km = 5000m)
                            strokeWeight: 2,             // 선 두께
                            strokeColor: '#4A90E2',      // 테두리 색
                            strokeOpacity: 0.8,          // 테두리 투명도
                            strokeStyle: 'solid',        // 테두리 스타일
                            fillColor: '#4A90E2',        // 내부 색
                            fillOpacity: 0.2             // 내부 투명도
                        });
    
                        // 지도에 원 표시
                        circle.setMap(map);
    
                        map.setCenter(loc);
                    });
                }
            });
        }, []);

    return(
        <div className="findchargerlogout_container">
            <div className="findchargerlogout_map">
                <div
                    ref={mapRef}
                    id="kakao-map"
                    style={{
                        width: "100%",
                        height: "685px",
                        background: "#eee",
                        borderRadius: "10px",
                    }}
                />
                <div className={`findchargerlogout_searchbar ${isSlide ? 'slide-left' : ''}`}>
                    <h3>충전소 찾기</h3>
                    <form>
                        <div className="findchargerlogout_location_btn">
                            <img src="/image/location_on.png" />
                            <button type="button" onClick={handleProtectedRoute}>현재 위치 기반으로 찾기</button>
                        </div>
                        <div className="findchargerlogout_search">
                            <img src="/image/search.png"/>
                            <input className="findchargerlogout_input" placeholder="장소,주소 검색"/>
                        </div>
                        <div className="findchargerlogout_filter_option">
                            <div className="findchargerlogout_filter_header">
                                <img src="/image/filter.png"/>
                                필터 옵션
                            </div>
                            <hr style={{border:"1px solid rgba(235, 235, 235, 1)", margin:"3px 0"}}/>
                            <div className="findchargerlogout_filter_brand">
                                충전기 회사<br/>
                                <select>
                                    <option>LG U+voltup</option>
                                    <option>해피차저</option>
                                </select>
                            </div>
                        </div>
                        <div className="findchargerlogout_filter_charger_type">
                            충천 타입<br/>
                            <select>
                                <option>DC 콤보</option>
                                <option>AC 3상</option>
                            </select>
                        </div>
                        <div className="findchargerlogout_filter_charger_speed">
                            충천 속도<br/>
                            <select>
                                <option>급속</option>
                                <option>완속</option>
                            </select>
                        </div>
                        <div className="findchargerlogout_filter_extra">
                            추가옵션<br/>
                            <div className="findchargerlogout_filter_extra_checkbox">
                            <label className="custom_checkbox">
                                <input type="checkbox" />
                                <span className="checkmark"></span>
                                대기없음
                            </label>
                            <label className="custom_checkbox">
                                <input type="checkbox" />
                                <span className="checkmark"></span>
                                개방 주차장
                            </label>
                            </div>
                        </div>
                        <div className="findchargerlogout_find_btn">
                            <button onClick={handleProtectedRoute}><div><AiOutlineThunderbolt /></div><span>충전소 검색하기</span></button>
                        </div>
                    </form>
                    <hr style={{border:"1px solid rgba(235, 235, 235, 1)", margin:"20px 0 10px 0"}}/>
                    <div className="findchargerlogout_from">
                        출처: 한국환경공단
                    </div>
                </div>
            </div>
            <button className={`slide_arrow_btn ${isSlide ? 'slid' : ''}`} onClick={handleSlide}>
                    {isSlide ? <BiChevronRight /> : <BiChevronLeft />}
            </button>
            <div className="findchargerlogout_ad">
                <div className="findchargerlogout_ad_header">
                    <h3>Re:charge 장소 추천</h3>
                    <p>충전의 순간, 나를 위한 재충전의 시간</p>
                </div>
                <div className="findchargerlogout_ad_list">
                    <div className="findchargerlogout_ad_card">
                        <img src="https://placehold.co/300x169?text=restaurant" />
                        <div className="findchargerlogout_ad_icon">
                            광고
                        </div>
                        <div className="findchargerlogout_ad_card_content">
                            <h3>휴먼카페</h3>
                            <div className="findchargerlogout_ad_content_address">
                                <div>
                                    <img src="/image/location_on.png"/>
                                    <p>천안시 동남구 대흥동 134</p>
                                </div>
                                <p style={{color:"rgba(202, 202, 202, 1)"}}>|</p>
                                <p>tel: 041-123-4567</p>
                            </div>
                            <div className="findchargerlogout_ad_btn">
                                <div>
                                    <button><img src="/image/naver-logo.png"/></button>
                                    <p>네이버지도로 이동</p>
                                </div>
                                <div>
                                    <button><img src="/image/kakao-logo.png"/></button>
                                    <p>카카오맵으로 이동</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="findchargerlogout_ad_card">
                        <img src="https://placehold.co/300x169?text=restaurant" />
                        <div className="findchargerlogout_ad_icon">
                            광고
                        </div>
                        <div className="findchargerlogout_ad_card_content">
                            <h3>휴먼카페</h3>
                            <div className="findchargerlogout_ad_content_address">
                                <div>
                                    <img src="/image/location_on.png"/>
                                    <p>천안시 동남구 대흥동 134</p>
                                </div>
                                <p style={{color:"rgba(202, 202, 202, 1)"}}>|</p>
                                <p>tel: 041-123-4567</p>
                            </div>
                            <div className="findchargerlogout_ad_btn">
                                <div>
                                    <button><img src="/image/naver-logo.png"/></button>
                                    <p>네이버지도로 이동</p>
                                </div>
                                <div>
                                    <button><img src="/image/kakao-logo.png"/></button>
                                    <p>카카오맵으로 이동</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="findchargerlogout_ad_card">
                        <img src="https://placehold.co/300x169?text=restaurant" />
                        <div className="findchargerlogout_ad_icon">
                            광고
                        </div>
                        <div className="findchargerlogout_ad_card_content">
                            <h3>휴먼카페</h3>
                            <div className="findchargerlogout_ad_content_address">
                                <div>
                                    <img src="/image/location_on.png"/>
                                    <p>천안시 동남구 대흥동 134</p>
                                </div>
                                <p style={{color:"rgba(202, 202, 202, 1)"}}>|</p>
                                <p>tel: 041-123-4567</p>
                            </div>
                            <div className="findchargerlogout_ad_btn">
                                <div>
                                    <button><img src="/image/naver-logo.png"/></button>
                                    <p>네이버지도로 이동</p>
                                </div>
                                <div>
                                    <button><img src="/image/kakao-logo.png"/></button>
                                    <p>카카오맵으로 이동</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FindChargerLogout;