import axios from "axios";

const BASE_URL = "/recharge/api/notice";

// 전체 조회
export const getAllNotices = async () => {
  try {
    const res = await axios.get(BASE_URL);
    return res.data;
  } catch (err) {
    console.error("공지사항 조회 실패:", err);
    return [];
  }
};

// 단건 조회
export const getNoticeById = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/${id}`);
    return res.data;
  } catch (err) {
    console.error("공지사항 단건 조회 실패:", err);
    return null;
  }
};

// 공지 등록
export const createNotice = async (notice) => {
  try {
    const res = await axios.post(BASE_URL, notice);
    return res.data;
  } catch (err) {
    console.error("공지사항 등록 실패:", err);
  }
};

// 공지 수정
export const updateNotice = async (id, notice) => {
  try {
    const res = await axios.put(`${BASE_URL}/${id}`, notice);
    return res.data;
  } catch (err) {
    console.error("공지사항 수정 실패:", err);
  }
};

// 공지 삭제
export const deleteNotice = async (id) => {
  try {
    const res = await axios.delete(`${BASE_URL}/${id}`);
    return res.data;
  } catch (err) {
    console.error("공지사항 삭제 실패:", err);
  }
};