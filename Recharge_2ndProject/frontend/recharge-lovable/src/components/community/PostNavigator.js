import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../../css/community/PostNavigator.css";

const PostNavigator = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // 현재 게시글 ID 가져오기
  const [prevPost, setPrevPost] = useState(null);
  const [nextPost, setNextPost] = useState(null);

  useEffect(() => {
    const fetchNavigationData = async () => {
      try {
        const response = await axios.get(`/recharge/api/community/${id}/nav`);
        console.log("이전/다음 글 데이터:", response.data);
        setPrevPost(response.data.prevPost || null);
        setNextPost(response.data.nextPost || null);
      } catch (error) {
        console.error("이전/다음 글 데이터를 가져오는 중 오류 발생:", error);
      }
    };

    fetchNavigationData();
  }, [id]);

  return (
    <div className="community_detail-nav">
      <div className="community_nav-section">
        <div className="community_nav-label">이전 글</div>
        <div className="community_nav-line" />
        <div
          className={`community_nav-item ${!prevPost ? "disabled" : ""}`}
          onClick={() => prevPost?.communityPostId && navigate(`/community/detail/${prevPost.communityPostId}`)}
        >
          {prevPost?.communityTitle || "이전 글이 없습니다."}
        </div>
      </div>

      <div className="community_nav-section">
        <div className="community_nav-label">다음 글</div>
        <div className="community_nav-line" />
        <div
          className={`community_nav-item ${!nextPost ? "disabled" : ""}`}
          onClick={() => nextPost?.communityPostId && navigate(`/community/detail/${nextPost.communityPostId}`)}
        >
          {nextPost?.communityTitle || "다음 글이 없습니다."}
        </div>
      </div>
    </div>
  );
};

export default PostNavigator;