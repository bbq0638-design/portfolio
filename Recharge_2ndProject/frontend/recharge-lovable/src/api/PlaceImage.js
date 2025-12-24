import axios from "axios";

export const fetchPlaceImage = async (query) => {
  try {
    const res = await axios.get("/recharge/api/place/image", {
      params: { query },
    });
    return res.data;
  } catch (err) {
    console.error("이미지 API 실패:", err);
    return null;
  }
};