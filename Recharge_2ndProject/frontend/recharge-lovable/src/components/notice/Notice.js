import React, { useEffect, useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import "../../css/notice/Notice.css";
import { getAllNotices} from "../../api/NoticeApi";

function Notice() {

    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 4; // 페이지당 게시글 수
    const navigate = useNavigate();
    
      // 목록 클릭 시 상세페이지로 이동
      const handleNoticeClick = (notice) => {
        navigate(`/notice/detail/${notice.id}`);
      };
    

    // ✅ Axios로 데이터 불러오기
    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const data = await getAllNotices();
                //오라클 date > 문자열로 전환
                const mapped = data.map((item) => ({
                    id: item.noticeId,
                    title: item.noticeTitle,
                    content: item.noticeContent,
                    date: item.createDate ? item.createDate.split("T")[0]:"",
                    views: Math.floor(Math.random() * 300),
                   
                }));
                setNotices(mapped);
            } catch (err) {
                console.error("데이터 불러오기 오류:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotices();
    }, []);

    // 페이지네이션
    const totalPages = Math.ceil(notices.length / postsPerPage);
    const indexOfLast = currentPage * postsPerPage;
    const indexOfFirst = indexOfLast - postsPerPage;
    const currentPosts = notices.slice(indexOfFirst, indexOfLast);

    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

  

    if (loading) return <p style={{ textAlign: "center" }}>로딩 중...</p>;

    
    // ✅ 목록 
    return (
        <div className="notice_wrapper">
            <div className="notice_header">
                <h1>공지사항</h1>
                <p className="notice_subtitle">Re:charge의 중요한 소식과 업데이트를 확인하세요</p>
            </div>

            <div className="notice_list">
                {currentPosts.map((notice) => (
                    <div
                        key={notice.id}
                        className={`notice_card ${notice.isImportant ? "notice_important" : ""}`}
                        onClick={() => handleNoticeClick(notice)}
                    >
                        <div className="notice_card_header">
                            {notice.isImportant && <span className="notice_important_badge">중요</span>}
                            <h3 className="notice_card_title">{notice.title}</h3>
                        </div>
                        <div className="notice_card_content">
                            <p>{notice.content.length > 100 ? notice.content.substring(0, 100) + "..." : notice.content}</p>
                        </div>
                        <div className="notice_card_footer">
                            <span className="notice_card_date">{notice.date}</span>
                            <span className="notice_card_views">조회수 {notice.views}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 페이지네이션 */}
            <div className="notice_pagination">
                <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>&laquo;</button>
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>&lt;</button>
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i + 1}
                        className={currentPage === i + 1 ? "active" : ""}
                        onClick={() => handlePageChange(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>&gt;</button>
                <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>&raquo;</button>
            </div>
        </div>
    );
}

export default Notice;
