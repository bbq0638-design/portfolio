import React, { useEffect, useRef } from "react";

function KakaoMapTest() {
  const mapRef = useRef(null);

  useEffect(() => {
    console.log("1) window.kakao =", window.kakao);

    if (!window.kakao || !window.kakao.maps) {
      console.log("❌ Kakao SDK 아직 로드 안됨");
      return;
    }

    window.kakao.maps.load(() => {
      console.log("2) Kakao Maps 로드됨!");

      const map = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 3
      });
    });
  }, []);

  return (
    <div 
      id="map"
      ref={mapRef}
      style={{ width: "100%", height: "500px", background: "#eee" }}
    ></div>
  );
}

export default KakaoMapTest;