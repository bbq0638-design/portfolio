import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/community/Community.css";
import { FaThumbsUp, FaEye } from "react-icons/fa";

import { getAllCommunityPosts } from "../../api/CommunityApi";
import { useAuth } from "../../context/AuthContext"; // 로그인 상태 가져오기

function Community() {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState("all");
  const postsPerPage = 6;
  const navigate = useNavigate();
  const { isLogin, userId } = useAuth(); // 로그인 상태와 사용자 ID 가져오기

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllCommunityPosts();
        setAllPosts(data);
      } catch (err) {
        console.error("게시글 불러오기 오류", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // ✅ 인기글 + 최신글 정렬
  const getSortedPosts = () => {
    let filteredPosts =
      selectedTab === "all"
        ? allPosts
        : allPosts.filter((p) => p.communityTab === selectedTab);

    // 인기글 top3
    const popularPosts = [...filteredPosts]
      .sort((a, b) => b.communityViewCount - a.communityViewCount)
      .slice(0, 3);

    // 나머지는 최신순
    const latestPosts = filteredPosts
      .filter((p) => !popularPosts.some((pop) => pop.communityPostId === p.communityPostId))
      .sort((a, b) => new Date(b.createDate) - new Date(a.createDate));

    return [...popularPosts, ...latestPosts];
  };

  const sortedPosts = getSortedPosts();

  // ✅ 페이지네이션
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);
  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // ✅ 글쓰기 버튼
  const handleWriteClick = () => {
    if (!isLogin) {
      alert("로그인이 필요합니다.");
      navigate("/login"); // 로그인 페이지로 이동
      return;
    }
    navigate("/community/write", { state: { userId } }); // 로그인된 사용자 ID와 함께 글쓰기 페이지로 이동
  };

  return (
    <div className="community_board-wrapper">
      <div className="community_board-header">
        <h2>자유게시판</h2>
        <button className="community_write-btn" onClick={handleWriteClick}>
          글작성하기
        </button>
      </div>

      {/* 카테고리 탭 */}
      <div className="community_category-tabs">
        <button
          className={selectedTab === "all" ? "active" : ""}
          onClick={() => {
            setSelectedTab("all");
            setCurrentPage(1);
          }}
        >
          전체
        </button>
        <button
          className={selectedTab === "review" ? "active" : ""}
          onClick={() => {
            setSelectedTab("review");
            setCurrentPage(1);
          }}
        >
          충전소 이용후기 & 경험
        </button>
        <button
          className={selectedTab === "tips" ? "active" : ""}
          onClick={() => {
            setSelectedTab("tips");
            setCurrentPage(1);
          }}
        >
          전기차 꿀팁 & 사용정보
        </button>
        <button
          className={selectedTab === "safety" ? "active" : ""}
          onClick={() => {
            setSelectedTab("safety");
            setCurrentPage(1);
          }}
        >
          안전·사고 대처
        </button>
      </div>

      {/* 게시글 목록 */}
      <div className="community_board-container">
        {loading ? (
          <div>로딩 중...</div>
        ) : sortedPosts.length === 0 ? (
          <div className="community_empty-state">게시글이 없습니다.</div>
        ) : (
          <div className="community_posts-list">
            {currentPosts.map((post, index) => (
              <div
                key={post.communityPostId}
                className="community_post-card"
                onClick={() => navigate(`/community/detail/${post.communityPostId}`)}
              >
                {currentPage === 1 && index < 3 && (
                  <div className={`community_post-rank rank-${index + 1}`}>
                    🔥 인기글
                  </div>
                )}

                <img
                  src={
                    post.communityImagePath
                      ? `/recharge${post.communityImagePath}`
                      : "/default-image.png" // ← 바로 이렇게 사용
                  }
                  alt={post.communityTitle}
                  className="community_post-image"
                />
                <div className="community_post-body">
                  <div className="community_post-title"> {post.communityTitle} </div>

                  <div className="community_post-meta">
                    <div className="community_post-meta-left">
                      <span className="community_user">{post.userId}</span>
                      <span className="community_post-likes">
                        <FaThumbsUp className="community_like-icon" /> {post.communityLikeCount}
                      </span>
                      <span className="community_post-views">
                        <FaEye /> {post.communityViewCount}
                      </span>
                    </div>
                    <span className="community_post-date">
                      {new Date(post.createDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 페이지네이션 */}
        {sortedPosts.length > 0 && (
          <div className="community_pagination">
            <button onClick={() => handlePageChange(1)}>&laquo;</button>
            <button onClick={() => handlePageChange(currentPage - 1)}>&lt;</button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => handlePageChange(currentPage + 1)}>&gt;</button>
            <button onClick={() => handlePageChange(totalPages)}>&raquo;</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Community;