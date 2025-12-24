// src/api/Station.js
import axios from "axios";

export const fetchStationsNearby = async (lat, lng, radiusKm = 5) => {
    try {
        return await axios.get(
            "/recharge/api/station/nearby-with-chargers",
            {
                params: {
                    lat,
                    lng,
                    radius: radiusKm,
                },
            }
        );
    } catch (err) {
        console.error("🚨 스테이션 + 충전기 API 오류:", err);
        return null;
    }
};
