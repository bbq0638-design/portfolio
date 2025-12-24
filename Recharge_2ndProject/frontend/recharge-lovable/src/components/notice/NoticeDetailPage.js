import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/notice/NoticeDetailPage.css";
import PostNavigator from "../community/PostNavigator";

function NoticeDetailPage() {
  
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    const fetchNotice = async () => {
      try{
        const response = await axios.get(`/recharge/api/notice/${id}`);
        setPost(response.data);

      } catch (error) {
        console.error("공지불러오기실패:",error);
        alert("공지사항을 불러오는중 오류가 발생했습니다");
      }finally {
          setLoading(false);
        }
      };
    
      fetchNotice();
    },[id]);
     

  if (!post) return <p>로딩 중...</p>;
  if (!post) return <p>공지사항을 찾을 수 없습니다.</p>;

 return (
  <div className="notice_board-wrapper">
    <div className="notice_board-header">
      <h2>공지사항</h2>
    </div>

    <div className="notice_detail-container">
      {/* 게시글 상단 */}
      <div className="notice_detail-header">
        <h2>{post.noticeTitle}</h2>
        <div className="notice_detail-meta">
          <span>게시일: {post.createDate ? post.createDate.split("T")[0]:"날짜없음"}</span>
        </div>
      </div>

      {/* 게시글 내용 */}
      <div className="notice_detail-content">
        <p>{post.noticeContent}</p>
      </div>

      <PostNavigator/>
    </div>

    {/* 목록으로 버튼 */}
    <div className="notice_detail-bottom">
      <button className="notice_back-btn" onClick={() => navigate("/notice")}>
        목록으로
      </button>
    </div>
  </div>
);
}

export default NoticeDetailPage;