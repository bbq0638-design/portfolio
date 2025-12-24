import axios from "axios";

const BASE_URL = "/recharge/api/community"; //spring CommunityController주소

//전체게시글 조회
export const getAllCommunityPosts = async () => {
    const res = await axios.get(BASE_URL);
    return res.data;
};

//단건 조회

export const getCommunityPost = async (id) => {
    const res = await axios.get(`${BASE_URL}/${id}`);
    return res.data;

};

 //글등록
export const createCommunityPost = async (post) => {
    const res = await axios.post(BASE_URL, post);
    return res.data;
};

//글수정

export const updateCommunityPost = async (id,post) =>{
    const res = await axios.put(`${BASE_URL}/${id}`, post);
    return res.data;
}

export const deleteCommunityPost = async (id) => {
    const res = await axios.delete(`${BASE_URL}/${id}`);
    return res.data;
};