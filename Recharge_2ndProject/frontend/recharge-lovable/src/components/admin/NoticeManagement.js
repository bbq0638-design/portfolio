import React, { useState, useEffect } from "react";
import {Link, useNavigate} from 'react-router-dom';
import '../../css/admin/NoticeManagement.css';
import axios from "axios";

function NoticeManagement() {

    const [noticeList, setNoticeList] = useState([]);
    const navigate = useNavigate();

     useEffect(() => {
        const fetchNoticeList = async () => {
            try {
                const res = await axios.get(
                    "/recharge/api/notice"
                );
                setNoticeList(res.data || []);
            } catch (err) {
                console.error("공지사항 로딩 실패:", err);
                alert("공지사항을 불러올 수 없습니다.");
            }
        };

        fetchNoticeList();
    }, []);

    const handleDelete = async (noticeId) => {
        if (!window.confirm("해당 공지사항을 삭제하시겠습니까?")) return;

        try {
            await axios.delete(
                `/recharge/api/notice/${noticeId}`
            );

            alert("공지사항이 삭제되었습니다.");
            setNoticeList((prev) => prev.filter(n => n.noticeId !== noticeId));
        } catch (err) {
            console.error("삭제 실패:", err);
            alert("공지사항 삭제 중 오류가 발생했습니다.");
        }
    };
   

    return (
        
        <div className="admin_container">
            <aside className="admin_nav_container">
                <h2>관리자 메뉴</h2>
                <ul className="admin_content_nav">
                    <li><Link to="/admin/reportmanage" className="active">신고관리</Link></li>
                    <li><Link to="/admin/noticemanage">공지사항 관리</Link></li>
                </ul>
            </aside>

            {/* 본문 */}
            <main className="NoticeManagement_main_content">
                <h1>공지사항 관리</h1>

                    <form className="NoticeManagement_form1">
                        <div id="NoticeManagement_form1_col1">
                            <input type="text"></input>
                            <button id="NoticeManagement_search">검색</button>
                            <button
                                id="write_btn"
                                type="button"
                                onClick={() => navigate("/admin/noticeboard")}
                                >
                                공지글 작성
                            </button>
                        </div>
                            
                    </form>
               <table className="NoticeManagement_table">
                    <thead>
                        <tr>
                            
                            <th id="NoticeManagement_table_No">번호</th>
                            <th id="NoticeManagement_table_title">제목</th>
                            <th id="NoticeManagement_table_date">작성일</th>
                            <th id="NoticeManagement_manage">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {noticeList.length === 0 ? (
                            <tr>
                                <td colSpan="4">등록된 공지사항이 없습니다.</td>
                            </tr>
                        ) : (
                            noticeList.map((n, index) => (
                                <tr key={n.noticeId}>
                                    <td>{index + 1}</td>
                                    <td>{n.noticeTitle}</td>
                                    <td>
                                        {new Date(n.createDate)
                                            .toISOString()
                                            .split("T")[0]}
                                    </td>
                                    <td>
                                        <button
                                            id="NoticeManagement_modify"
                                            onClick={() => navigate(`/admin/noticeboard/${n.noticeId}`)}
                                        >
                                            수정
                                        </button>
                                        <button
                                            id="NoticeManagement_delete"
                                            onClick={() =>
                                                handleDelete(n.noticeId)
                                            }
                                        >
                                            삭제
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
               </table>
                {/*페이지네이션 */}
                {/* npm install react-paginate*/}
            </main>
        </div>
    );
}


export default NoticeManagement;