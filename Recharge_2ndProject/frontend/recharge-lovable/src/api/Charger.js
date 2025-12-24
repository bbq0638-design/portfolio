import axios from "axios";

export const fetchChargersByStation = async (stationId) => {
  try {
    const res = await axios.get(`/recharge/api/charger/station/${stationId}`);
    return res;
  } catch (err) {
    console.error("⚠️ 충전기 정보 불러오기 실패:", err);
    return null;
  }
};