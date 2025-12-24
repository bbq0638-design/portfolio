import axios from "axios";

//const BASE_URL = "http://localhost:10809/recharge/api/report";

// 신고 등록


export const submitReport = async (data) => {
  if (!data.reportTargetId) {
    throw new Error("신고 대상 ID가 없습니다.");
  }

  return axios.post("/recharge/api/report", data, {
    headers: { "Content-Type": "application/json" },
  });
};
