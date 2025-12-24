import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../css/admin/NoticeBoard.css";

function NoticeBoard() {
  const { id } = useParams(); // ✔ 수정모드 확인
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // ✔ 수정 모드일 경우 기존 공지사항 불러오기
  useEffect(() => {
    if (!id) return; // 작성 모드일 때는 실행 X

    const fetchNotice = async () => {
      try {
        const res = await axios.get(
          `/recharge/api/notice/${id}`
        );
        setTitle(res.data.noticeTitle);
        setContent(res.data.noticeContent);
      } catch (err) {
        console.error("공지사항 로드 실패:", err);
      }
    };

    fetchNotice();
  }, [id]);

  // ✔ 등록/수정 공용 함수
  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력하세요.");
      return;
    }

    try {
      if (id) {
        // ----------- 수정 -----------
        await axios.put(
          `/recharge/api/notice/${id}`,
          {
            noticeTitle: title,
            noticeContent: content,
            updatedId: "admin",
          }
        );
        alert("공지사항이 수정되었습니다.");
      } else {
        // ----------- 새 글 작성 -----------
        await axios.post(
          `/recharge/api/notice`,
          {
            noticeTitle: title,
            noticeContent: content,
            userId: "admin",
          }
        );
        alert("공지사항이 등록되었습니다.");
      }

      navigate("/admin/noticemanage");
    } catch (err) {
      console.error("공지사항 저장 실패:", err);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="admin_container">

      <aside className="admin_nav_container">
        <h2>관리자 메뉴</h2>
        <ul className="admin_content_nav">
          <li><Link to="/admin/reportmanage">신고관리</Link></li>
          <li><Link to="/admin/noticemanage" className="active">공지사항 관리</Link></li>
        </ul>
      </aside>

      <div className="community_write-container">
        <h1>{id ? "공지사항 수정" : "공지사항 작성"}</h1>

        <div className="community_write-header">
          <input
            type="text"
            className="community_write-title"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="community_write-form">
          <textarea
            className="community_write-textarea"
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="community_submit-container">
          <button className="community_submit-btn" onClick={handleSubmit}>
            {id ? "수정하기" : "등록하기"}
          </button>
        </div>
      </div>

    </div>
  );
}

export default NoticeBoard;
