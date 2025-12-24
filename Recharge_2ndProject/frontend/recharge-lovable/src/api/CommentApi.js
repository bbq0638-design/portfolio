import axios from "axios";

const BASE_URL = "/recharge/api/comments";

// 댓글 목록 조회
export const getComments = async (targetType, targetId) => {
  const res = await axios.get(BASE_URL, { params: { targetType, targetId } });
  return res.data;
};

// 댓글 등록
export const addComment = async (comment) => {
  const res = await axios.post(BASE_URL, comment);
  return res.data;
};

// 댓글 삭제
export const deleteComment = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`);
};
