import React, { useState } from "react";
import { AiOutlineThunderbolt } from "react-icons/ai";

function SearchBar({ onSearch }) {

    const [keyword, setKeyword] = useState("");

    const [brand, setBrand] = useState("");
    const [chargerType, setChargerType] = useState("");
    const [chargerSpeed, setChargerSpeed] = useState("");
    const [noWait, setNoWait] = useState(false);
    const [freeParking, setFreeParking] = useState(false);

    const sendFilterOptions = {
        brand,
        chargerType,
        chargerSpeed,
        noWait,
        freeParking,
    };

    // ===========================
    // 🔍 주소 검색
    // ===========================
    const handleAddressSearch = () => {
        if (!keyword.trim()) {
            alert("검색할 주소를 입력하세요.");
            return;
        }

        const ps = new window.kakao.maps.services.Places();

        ps.keywordSearch(keyword, (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const first = data[0];

                const lat = parseFloat(first.y);
                const lng = parseFloat(first.x);

                if (onSearch) onSearch(lat, lng, sendFilterOptions);
            } else {
                alert("검색결과가 없습니다.");
            }
        });
    };

    const handleEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddressSearch();
        }
    };

    // ===========================
    // 📍 현재위치 검색
    // ===========================
    const handleCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("브라우저에서 현재 위치를 사용할 수 없습니다.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;

                if (onSearch) onSearch(lat, lng, sendFilterOptions);
            },
            () => alert("현재 위치를 가져올 수 없습니다.")
        );
    };

    return (
        <div>
            <h3>충전소 찾기</h3>
            <form>

                {/* 현재위치 */}
                <div className="findchargerlogout_location_btn">
                    <img src="/image/location_on.png" />
                    <button type="button" onClick={handleCurrentLocation}>
                        현재 위치 기반으로 찾기
                    </button>
                </div>

                {/* 검색 입력 */}
                <div className="findchargerlogout_search">
                    <img src="/image/search.png" />
                    <input
                        className="findchargerlogout_input"
                        placeholder="장소,주소 검색"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={handleEnter}
                    />
                </div>

                {/* 필터 옵션 */}
                <div className="findchargerlogout_filter_option">
                    <div className="findchargerlogout_filter_header">
                        <img src="/image/filter.png" />
                        필터 옵션
                    </div>
                    <hr style={{ border: "1px solid rgba(235, 235, 235, 1)", margin: "3px 0" }} />

                    {/* 브랜드 */}
                    <div className="findchargerlogout_filter_brand">
                        충전기 회사<br />
                        <select value={brand} onChange={(e) => setBrand(e.target.value)}>
                            <option value="">전체</option>

                            <option value="한국전기차충전서비스">한국전기차충전서비스</option>
                            <option value="한국전력공사">한국전력공사</option>
                            <option value="에버온">에버온</option>
                            <option value="대영채비">대영채비</option>
                            <option value="환경부">환경부</option>
                            <option value="GS칼텍스">GS칼텍스</option>
                            <option value="SK일렉링크">SK일렉링크</option>
                            <option value="타디스테크놀로지">타디스테크놀로지</option>
                            <option value="LG유플러스">LG유플러스</option>
                            <option value="해피차저">해피차저</option>
                        </select>
                    </div>
                </div>

                {/* 충전 타입 */}
                <div className="findchargerlogout_filter_charger_type">
                    충전 타입<br />
                    <select value={chargerType} onChange={(e) => setChargerType(e.target.value)}>
                        <option value="">전체</option>
                        <option value="04">DC 콤보</option>
                        <option value="02">AC 완속</option>
                        <option value="01">DC차데모</option>
                        <option value="03">DC차데모 + AC3상</option>
                        <option value="05">DC차데모 + DC콤보</option>
                        <option value="06">DC차데모 + AC3상 + DC콤보</option>
                        <option value="07">AC3상</option>
                        <option value="08">DC콤보(완속)</option>
                        <option value="09">NACS</option>
                        <option value="10">DC콤보 + NACS</option>
                        <option value="11">DC콤보2 (버스)</option>
                    </select>
                </div>

                {/* 충전 속도 */}
                <div className="findchargerlogout_filter_charger_speed">
                    충전 속도<br />
                    <select
                        value={chargerSpeed}
                        onChange={(e) => setChargerSpeed(e.target.value)}
                    >
                        <option value="">전체</option>
                        <option value="급속">급속</option>
                        <option value="중속">중속</option>
                        <option value="완속">완속</option>
                    </select>
                </div>

                {/* 추가옵션 */}
                <div className="findchargerlogout_filter_extra">
                    추가옵션<br />
                    <div className="findchargerlogout_filter_extra_checkbox">

                        <label className="custom_checkbox">
                            <input
                                type="checkbox"
                                checked={noWait}
                                onChange={(e) => setNoWait(e.target.checked)}
                            />
                            <span className="checkmark"></span>
                            대기없음
                        </label>

                        <label className="custom_checkbox">
                            <input
                                type="checkbox"
                                checked={freeParking}
                                onChange={(e) => setFreeParking(e.target.checked)}
                            />
                            <span className="checkmark"></span>
                            개방 주차장
                        </label>

                    </div>
                </div>

                {/* 검색 버튼 */}
                <div className="findchargerlogout_find_btn">
                    <button type="button" onClick={handleAddressSearch}>
                        <div><AiOutlineThunderbolt /></div>
                        <span>충전소 검색하기</span>
                    </button>
                </div>

            </form>
        </div>
    );
}

export default SearchBar;
