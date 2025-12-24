import React, { useEffect, useState } from "react";
import "../../css/community/PostComment.css";
import { getComments, addComment, deleteComment } from "../../api/CommentApi";
import axios from "axios";
import ReportModal from "../../components/modal/ReportModal";
import { useAuth } from "../../context/AuthContext";

function PostComment({ targetType, targetId }) {

  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);
  const { userId, isLogin } = useAuth();

  /** 날짜 포맷 */
  const formatDate = (dateString) =>
    new Date(dateString).toISOString().split("T")[0];

  /** 댓글 불러오기 */
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const list = await getComments(targetType, targetId);
        setComments(list || []);
      } catch (error) {
        console.error("댓글 데이터를 가져오는 중 오류 발생:", error);
      }
    };

    if (targetId) {
      fetchComments();
    }
  }, [targetType, targetId]);

  /** 댓글 추가 */
  const handleAddComment = async () => {
    if (!isLogin) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!commentInput.trim()) return;

    const commentData = {
      commentTargetType: targetType,
      commentTargetId: targetId,
      userId: userId,
      commentContent: commentInput,
      createId: userId,
      updatedId: userId,
    };

    try {
      const newComment = await addComment(commentData);
      setComments([...comments, newComment]);
      setCommentInput("");
    } catch (err) {
      console.error("댓글 등록 실패:", err);
      alert("댓글 등록 중 오류가 발생했습니다.");
    }
  };

  /** 댓글 삭제 */
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      await deleteComment(commentId);
      setComments(comments.filter((c) => c.commentId !== commentId));
    } catch (err) {
      console.error("댓글 삭제 실패:", err);
      alert("댓글 삭제 중 오류가 발생했습니다.");
    }
  };

  /** 댓글 신고 */
  const handleReportComment = (commentId) => {
    setReportTarget({ type: "comment", id: commentId });
    setIsReportOpen(true);
  };

  /** 신고 제출 */
  const handleReportSubmit = async (reason) => {
    if (!reportTarget) return;

    const reportData = {
      userId: userId,
      reportTargetType: reportTarget.type,
      reportTargetId: reportTarget.id,
      reportReason: reason,
      createId: userId,
    };

    try {
      await axios.post("/recharge/api/report", reportData);
      alert("신고가 접수되었습니다.");
      setIsReportOpen(false);
    } catch (error) {
      console.error("신고 처리 중 오류 발생:", error);
      alert("신고 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="community_comment-container">
      <h3>댓글</h3>

      <ul className="community_comment-list">
        {comments.length === 0 ? (
          <li className="no-comment">아직 댓글이 없습니다.</li>
        ) : (
          comments.map((c) => (
            <li key={c.commentId} className="community_comment-item">
              <div className="community_comment-top">
                <span className="community_comment-user">{c.userId}</span>
                <span className="community_comment-date">
                  {formatDate(c.createDate)}
                </span>
              </div>

              <div className="community_comment-body">
                <span className="community_comment-content">
                  {c.commentContent}
                </span>

                <div className="community_comment-actions">
                  {(userId === c.userId || userId === "admin") && (
                    <button
                      className="community_comment-delete-btn"
                      onClick={() => handleDeleteComment(c.commentId)}
                    >
                      ❌
                    </button>
                  )}

                  <button
                    className="community_comment-report-btn"
                    onClick={() => handleReportComment(c.commentId)}
                  >
                    신고
                  </button>
                </div>

              </div>
            </li>
          ))
        )}
      </ul>

      <div className="community_comment-input">
        <input
          className="community_comment-inputbox"
          type="text"
          placeholder="댓글을 입력하세요"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
        />
        <button className="community_comment-btn" onClick={handleAddComment}>
          등록
        </button>
      </div>

      {/* 신고 모달 */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
}

export default PostComment;
