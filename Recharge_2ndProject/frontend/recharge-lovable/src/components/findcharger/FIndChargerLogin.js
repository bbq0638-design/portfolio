import React, { useState, useRef, useEffect } from "react";
import "../../css/findcharger/FindChargerLogin.css";
import axios from "axios";
import SearchBar from "./SearchBar";
import FindChargerResult from "./FindChargerResult";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { fetchPlaceImage } from "../../api/PlaceImage";

function FindChargerLogin() {
    const [isSlide, setIsSlide] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [searchCoords, setSearchCoords] = useState(null);
    const [filterOptions, setFilterOptions] = useState({});
    const [places, setPlaces] = useState([]);

    const mapRef = useRef(null);
    const searchMarkerRef = useRef(null);
    const searchCircleRef = useRef(null);
    const myCircleRef = useRef(null);
    const myLocationMarkerRef = useRef(null);

    const PLACEHOLDER = "https://placehold.co/200x140?text=no+image";

    /** 🔍 장소 정보 + 이미지 가져오기 */
    const handlePlaceSearch = async (lat, lng) => {
        const res = await axios.get(
            `/recharge/api/place/nearby?lat=${lat}&lng=${lng}`
        );

        const merged = [
            ...(res.data.food || []),
            ...(res.data.cafe || []),
        ];

        const PLACEHOLDER = "https://placehold.co/200x140?text=no+image";

        for (const p of merged) {
            // 업종(분류) 명 미리 세팅 (카카오에서 주는 category_group_code 기준)
            let businessType = "";
            if (p.category_group_code === "FD6") businessType = "음식점";
            if (p.category_group_code === "CE7") businessType = "카페";

            // 가장 정확도가 높은 순서대로 이미지 검색 query 생성
            let queryList = [
                `${p.place_name} ${p.address_name}`,           // 지번주소
                `${p.place_name} ${p.road_address_name}`,      // 도로명 주소
                `${p.place_name} ${businessType}`,             // 업종
                `${p.place_name} 음식점`,
                `${p.place_name} 식당`,
                `${p.place_name} 카페`,
                `${p.place_name}`
            ];

            let imgUrl = null;

            // 위에서 만든 queryList 순서대로 이미지 URL 요청
            for (const q of queryList) {
                imgUrl = await fetchPlaceImage(q);
                if (imgUrl && imgUrl.trim() !== "") break;
            }

            p.imageUrl = imgUrl && imgUrl.trim() !== "" ? imgUrl : PLACEHOLDER;
        }

        setPlaces(merged);
    };



    /** 🔎 검색 시 실행 */
    const handleSearchClick = (lat, lng, filters = {}) => {

        if (myLocationMarkerRef.current) {
            myLocationMarkerRef.current.setMap(null);
            myLocationMarkerRef.current = null;
        }

        if (myCircleRef.current) {
            myCircleRef.current.setMap(null);
            myCircleRef.current = null;
        }

        if (searchMarkerRef.current) {
            searchMarkerRef.current.setMap(null);
            searchMarkerRef.current = null;
        }
        if (searchCircleRef.current) {
            searchCircleRef.current.setMap(null);
            searchCircleRef.current = null;
        }

        if (window.clearStationMarkers) window.clearStationMarkers();

        setSearchCoords({ lat, lng });
        setFilterOptions(filters);
        setShowResult(true);
    };


    const handleSlide = () => setIsSlide(!isSlide);

    /** 🔄 검색 초기화 */
    const handleResetSearch = () => {
        setShowResult(false);
        setSearchCoords(null);

        const map = window.currentMap;

        if (window.clearStationMarkers) window.clearStationMarkers();

        if (searchMarkerRef.current) {
            searchMarkerRef.current.setMap(null);
            searchMarkerRef.current = null;
        }
        if (searchCircleRef.current) {
            searchCircleRef.current.setMap(null);
            searchCircleRef.current = null;
        }
        if (myCircleRef.current) {
            myCircleRef.current.setMap(null);
            myCircleRef.current = null;
        }
        if (myLocationMarkerRef.current) {
            myLocationMarkerRef.current.setMap(null);
            myLocationMarkerRef.current = null;
        }

        // 다시 현재 위치로 표시
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const loc = new window.kakao.maps.LatLng(
                    pos.coords.latitude,
                    pos.coords.longitude
                );
                const marker = new window.kakao.maps.Marker({
                    map,
                    position: loc,
                });
                myLocationMarkerRef.current = marker;

                const circle = new window.kakao.maps.Circle({
                    center: loc,
                    radius: 5000,
                    strokeWeight: 2,
                    strokeColor: "#4A90E2",
                    strokeOpacity: 0.8,
                    strokeStyle: "solid",
                    fillColor: "#4A90E2",
                    fillOpacity: 0.2,
                });

                circle.setMap(map);
                myCircleRef.current = circle;

                map.setCenter(loc);
            });
        }
    };


    /** 🗺 최초 지도 렌더링 */
    useEffect(() => {
        if (!window.kakao || !window.kakao.maps) return;

        if (!window.mapInitialized) {
            window.mapInitialized = true;

            window.kakao.maps.load(() => {
                const container = mapRef.current;
                const map = new window.kakao.maps.Map(container, {
                    center: new window.kakao.maps.LatLng(36.8074, 127.1470),
                    level: 7,
                });

                window.currentMap = map;

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((pos) => {
                        const loc = new window.kakao.maps.LatLng(
                            pos.coords.latitude,
                            pos.coords.longitude
                        );

                        const myMarker = new window.kakao.maps.Marker({
                            map,
                            position: loc,
                        });
                        myLocationMarkerRef.current = myMarker;

                        const circle = new window.kakao.maps.Circle({
                            center: loc,
                            radius: 5000,
                            strokeWeight: 2,
                            strokeColor: "#4A90E2",
                            strokeOpacity: 0.8,
                            strokeStyle: "solid",
                            fillColor: "#4A90E2",
                            fillOpacity: 0.2,
                        });

                        circle.setMap(map);
                        myCircleRef.current = circle;

                        map.setCenter(loc);
                    });
                }
            });
        }
    }, []);


    /** 🗺 검색 좌표에 중심 이동 + 마커 표시 */
    useEffect(() => {
        if (!searchCoords || !window.currentMap) return;

        const map = window.currentMap;
        const { lat, lng } = searchCoords;
        const pos = new window.kakao.maps.LatLng(lat, lng);

        map.setCenter(pos);

        if (searchMarkerRef.current) searchMarkerRef.current.setMap(null);
        searchMarkerRef.current = new window.kakao.maps.Marker({ map, position: pos });

        if (searchCircleRef.current) searchCircleRef.current.setMap(null);
        searchCircleRef.current = new window.kakao.maps.Circle({
            center: pos,
            radius: 5000,
            strokeWeight: 2,
            strokeColor: "#4A90E2",
            strokeOpacity: 0.9,
            strokeStyle: "solid",
            fillColor: "#4A90E2",
            fillOpacity: 0.25,
        });
        searchCircleRef.current.setMap(map);

    }, [searchCoords]);


    return (
        <div className="findchargerlogout_container">
            <div className="findchargerlogout_map">
                <div
                    ref={mapRef}
                    style={{
                        width: "100%",
                        height: "685px",
                        background: "#eee",
                        borderRadius: "10px",
                    }}
                />

                <div className={`findchargerlogout_searchbar ${isSlide ? "slide-left" : ""}`}>
                    {showResult ? (
                        <FindChargerResult
                            coords={searchCoords}
                            filterOptions={filterOptions}
                            onReset={handleResetSearch}
                            onPlaceSearch={handlePlaceSearch}
                        />
                    ) : (
                        <SearchBar onSearch={handleSearchClick} />
                    )}
                    <hr style={{ border: "1px solid rgba(235, 235, 235, 1)", margin: "20px 0 10px" }} />
                    <div className="findchargerlogout_from">출처: 한국환경공단</div>
                </div>
            </div>

            <button
                className={`slide_arrow_btn ${isSlide ? "slid" : ""}`}
                onClick={handleSlide}
            >
                {isSlide ? <BiChevronRight /> : <BiChevronLeft />}
            </button>

            <div className="findchargerlogout_ad_header" style={{ padding: "20px 0" }}>
                <h3>Re:charge 장소 추천</h3>
                <p>충전의 순간, 나를 위한 재충전의 시간</p>
            </div>

            <div className="findchargerlogin_place_list">
                {places.map((p, idx) => (
                    <div className="findchargerlogin_place_card" key={idx}>
                        <img
                            src={p.imageUrl || PLACEHOLDER}
                            alt={p.place_name}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = PLACEHOLDER;
                            }}
                        />

                        <div className="findchargerlogin_place_card_content">
                            <h3>{p.place_name}</h3>
                            <div className="findchargerlogin_place_content_address">
                                <div>
                                    <img src="/image/location_on.png" />
                                    <p>{p.address_name}</p>
                                </div>
                                <p style={{ color: "rgba(202, 202, 202, 1)" }}>|</p>
                                <p>{p.phone || "전화번호 없음"}</p>
                            </div>

                            <div className="findchargerlogin_place_btn">
                                <div>
                                    <button><img src="/image/naver-logo.png" /></button>
                                    <p>
                                        <a href={`https://map.naver.com/v5/search/${p.place_name}`} target="_blank">
                                            네이버지도로 이동
                                        </a>
                                    </p>
                                </div>
                                <div>
                                    <button><img src="/image/kakao-logo.png" /></button>
                                    <p>
                                        <a href={`https://map.kakao.com/link/map/${p.id}`} target="_blank">
                                            카카오맵으로 이동
                                        </a>
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FindChargerLogin;
