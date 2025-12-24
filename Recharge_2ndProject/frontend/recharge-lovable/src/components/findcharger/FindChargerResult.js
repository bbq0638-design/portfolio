import React, { useEffect, useState, useRef } from "react";
import { fetchStationsNearby } from "../../api/Station";

function FindChargerResult({ coords, filterOptions, onReset, onPlaceSearch }) {
    const [stations, setStations] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const markersRef = useRef([]);
    const selectedMarkerRef = useRef(null);

    const clearMarkers = () => {
        markersRef.current.forEach((m) => m.marker.setMap(null));
        markersRef.current = [];
    };

    window.clearStationMarkers = clearMarkers;

    const getSpeedType = (speed) => {
        const s = Number(speed);
        if (!s) return "기타";
        if (s < 7) return "완속";
        if (s <= 50) return "중속";
        return "급속";
    };

    const applyFilters = (list) => {
        if (!filterOptions) return list;
        const { brand, chargerType, chargerSpeed, noWait, freeParking } = filterOptions;

        return list.filter((st) => {
            const chargers = st.chargers || [];
            if (!chargers.length) return false;

            if (brand && chargers[0].chargerProvider !== brand) return false;
            if (chargerType && !chargers.some((c) => c.chargerType === chargerType)) return false;
            if (chargerSpeed && !chargers.some((c) => getSpeedType(c.chargerSpeed) === chargerSpeed)) return false;
            if (noWait && !chargers.some((c) => c.status === "2")) return false;
            if (freeParking && st.stationParkingFree !== "Y") return false;

            return true;
        });
    };

    useEffect(() => {
        const load = async () => {
            if (!coords) return;
            const res = await fetchStationsNearby(coords.lat, coords.lng, 5);
            if (!res || !res.data) {
                setStations([]);
                clearMarkers();
                return;
            }
            const filtered = applyFilters(res.data);
            setStations(filtered);
        };
        load();
    }, [coords, filterOptions]);

    const limitedStations = stations.slice(0, 30);

    const chgerTypeMap = {
        "01": "DC차데모",
        "02": "AC완속",
        "03": "DC차데모 + AC3상",
        "04": "DC콤보",
        "05": "DC차데모 + DC콤보",
        "06": "DC차데모 + AC3상 + DC콤보",
        "07": "AC3상",
        "08": "DC콤보(완속)",
        "09": "NACS",
        "10": "DC콤보 + NACS",
        "11": "DC콤보2 (버스)",
    };
    const getChargerTypeName = (c) => chgerTypeMap[c] || "기타";

    const chgerTypeColorMap = {
        "01": "#FF4E4E",
        "02": "#00C9A7",
        "03": "#FF8A00",
        "04": "#2979FF",
        "05": "#B620E0",
        "06": "#FF007E",
        "07": "#00B345",
        "08": "#0081F7",
        "09": "#FFC400",
        "10": "#FF5C00",
        "11": "#424242",
    };
    const getChargerTypeColor = (c) => chgerTypeColorMap[c] || "#999";

    useEffect(() => {
        if (!window.currentMap) return;
        clearMarkers();
        if (!limitedStations.length) return;

        const map = window.currentMap;

        const defImg = new window.kakao.maps.MarkerImage(
            "/image/ev-marker.svg",
            new window.kakao.maps.Size(32, 32),
            { offset: new window.kakao.maps.Point(16, 32) }
        );
        const selImg = new window.kakao.maps.MarkerImage(
            "/image/ev-marker-selected.svg",
            new window.kakao.maps.Size(32, 32),
            { offset: new window.kakao.maps.Point(16, 32) }
        );

        limitedStations.forEach((st) => {
            if (!st.stationLatitude || !st.stationLongitude) return;
            const isSel = selectedMarkerRef.current === st.stationId;

            const marker = new window.kakao.maps.Marker({
                map,
                position: new window.kakao.maps.LatLng(st.stationLatitude, st.stationLongitude),
                image: isSel ? selImg : defImg,
            });

            markersRef.current.push({
                stationId: st.stationId,
                marker,
                defaultImage: defImg,
                selectedImage: selImg,
            });
        });
    }, [limitedStations]);

    const handleCardClick = (id, lat, lng) => {
        const map = window.currentMap;
        if (!map) return;

        if (selectedMarkerRef.current) {
            const old = markersRef.current.find((m) => m.stationId === selectedMarkerRef.current);
            if (old) old.marker.setImage(old.defaultImage);
        }

        const item = markersRef.current.find((m) => m.stationId === id);
        if (!item) return;

        item.marker.setImage(item.selectedImage);
        selectedMarkerRef.current = id;
        setSelectedCard(id);

        map.panTo(new window.kakao.maps.LatLng(lat, lng));
        if (onPlaceSearch) onPlaceSearch(lat, lng);
    };

    return (
        <div className="findcharger-result-wrapper" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <div style={{ flexShrink: 0 }}>
                <h3>충전소 찾기</h3>
                <hr style={{ border: "1px solid lightgray" }} />
                <div className="findchargerlogin_list_header">
                    <h3>검색결과</h3>
                    {coords && <button onClick={onReset}>새로검색</button>}
                </div>
                <p className="findchargerlogin_sub_header">
                    총 {stations.length}개의 충전소 중 <b style={{ color: "green" }}>상위 30개</b>만 지도에 표시합니다
                </p>
            </div>

            <div className="charger-scroll-area" style={{ flex: 1, overflowY: "auto", paddingRight: "6px" }}>
                {limitedStations.map((st, idx) => {
                    const lat = st.stationLatitude;
                    const lng = st.stationLongitude;
                    const total = st.chargers?.[0]?.chargerTotal || 0;
                    const available = st.chargers?.filter((c) => c.status === "2").length || 0;
                    const typeSet = [...new Set(st.chargers.map((c) => c.chargerType))];

                    return (
                        <div
                            key={idx}
                            className={
                                "findchargerlogin_charger_card " + (selectedCard === st.stationId ? "selected" : "")
                            }
                            onClick={() => handleCardClick(st.stationId, lat, lng)}
                            style={{ cursor: "pointer" }}
                        >
                            <div className="findchargerlogin_charger_card_header">
                                <h4>{st.stationName}</h4>
                                <p>{st.distanceKm ? `${st.distanceKm} Km` : ""}</p>
                            </div>

                            <div className="findchargerlogin_charger_card_address">
                                <img src="/image/location_on.png" />
                                <p>
                                    {st.stationAddress}
                                    {st.stationAddressDetail && st.stationAddressDetail !== "null"
                                        ? ` ${st.stationAddressDetail}`
                                        : ""}
                                    <span
                                        style={{
                                            marginLeft: "5px",
                                            color: st.stationParkingFree === "Y" ? "green" : "red",
                                        }}
                                    >
                                        / {st.stationParkingFree === "Y" ? "주차장 무료" : "주차장 유료"}
                                    </span>
                                </p>
                            </div>

                            <div className="findchargerlogin_charger_card_option">
                                <p style={{ fontWeight: "bold" }}>{st.chargers?.[0]?.chargerProvider}</p>

                                <div style={{ display: "flex", gap: "20px", fontSize: "13px", alignItems: "center" }}>
                                    <p>
                                        {[...new Set(st.chargers.map((c) => getSpeedType(c.chargerSpeed)))].join(", ")}
                                    </p>

                                    <p style={{ display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}>
                                        {typeSet.map((code) => (
                                            <span key={code} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                                <span
                                                    style={{
                                                        width: "8px",
                                                        height: "8px",
                                                        borderRadius: "50%",
                                                        backgroundColor: getChargerTypeColor(code),
                                                        display: "inline-block",
                                                    }}
                                                ></span>
                                                {getChargerTypeName(code)}
                                            </span>
                                        ))}
                                    </p>

                                    <p
                                        style={{
                                            minWidth: "120px",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            color: available === 0 ? "red" : "rgb(1,199,1)",
                                        }}
                                    >
                                        {available === 0 ? `0/${total} 빈 충전기 없음` : `${available}/${total} 사용가능`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default FindChargerResult;
