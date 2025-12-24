import React, { useState, useEffect } from "react"; // (수정) useEffect 임포트
import { Link } from 'react-router-dom';
import '../../css/admin/ReportManagement.css';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import axios from 'axios';

function ReportManagement() {

    const [reports, setReports] = useState([]);
    const [postReports, setPostReports] = useState([]);
    const [commentReports, setCommentReports] = useState([]);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await axios.get(
                    "/recharge/api/report/admin/Reportlist"
                );

                const list = res.data || [];

                // 게시글/댓글 나눠서 저장
                setPostReports(list.filter(r => r.reportTargetType !== "comment"));
                setCommentReports(list.filter(r => r.reportTargetType === "comment"));

                setReports(list);
            } catch (err) {
                console.error("신고 목록 로딩 실패:", err);
            }
        };

        fetchReports();
    }, []);



    return (
        <div className="admin_container">

            <aside className="admin_nav_container">
                <h2>관리자 메뉴</h2>
                <ul className="admin_content_nav">
                    <li><Link to="/admin/reportmanage" className="active">신고관리</Link></li>
                    <li><Link to="/admin/noticemanage">공지사항 관리</Link></li>
                </ul>
            </aside>


            <main className="reportManagement_main_content">
                <h1>신고 관리</h1>

                <Tabs defaultValue="posts">
                    <TabsList className="reportmanagement_tabs_list">
                        <TabsTrigger value="posts" className="reportmanagement_tabs">게시글({postReports.length})</TabsTrigger>
                        <TabsTrigger value="comments" className="reportmanagement_tabs">댓글({commentReports.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="posts">
                        <table className="reportmanagement_posts_table">
                            <thead>
                                <tr>
                                    <th className="reportmanagement_posts_table_col1">게시판</th>
                                    <th className="reportmanagement_posts_table_col2">글 제목/내용</th>
                                    <th className="reportmanagement_posts_table_col3">신고사유</th>
                                    <th className="reportmanagement_posts_table_col4">신고자</th>
                                    <th className="reportmanagement_posts_table_col5">피신고자</th>
                                    <th className="reportmanagement_posts_table_col7">신고상태</th>
                                    <th className="reportmanagement_posts_table_col">관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {postReports.length === 0 ? (
                                    <tr>
                                        <td colSpan="7">신고된 게시글이 없습니다.</td>
                                    </tr>
                                ) : (
                                    postReports.map((r) => (
                                        <tr key={r.reportId}>
                                            <td>{r.reportTargetType}</td>
                                            <td>{r.reportTargetId}</td>
                                            <td>{r.reportReason}</td>
                                            <td>{r.userId}</td>
                                            <td>{r.reportedUserId ?? "-"}</td>
                                            <td>{r.reportStatus}</td>
                                            <td>
                                                <button>글쓰기 정지</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </TabsContent>


                    <TabsContent value="comments">
                        {/* (수정) 댓글 테이블 className 추가 */}
                        <table className="reportmanagement_posts_table">
                            <thead>
                                <tr>
                                    <th className="reportmanagement_posts_table_col1">게시판</th>
                                    <th className="reportmanagement_posts_table_col2">댓글 내용</th>
                                    <th className="reportmanagement_posts_table_col3">신고사유</th>
                                    <th className="reportmanagement_posts_table_col4">신고자</th>
                                    <th className="reportmanagement_posts_table_col5">피신고자</th>
                                    <th className="reportmanagement_posts_table_col6">신고상태</th>
                                    <th className="reportmanagement_posts_table_col7">관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {commentReports.length === 0 ? (
                                    <tr>
                                        <td colSpan="7">신고된 댓글이 없습니다.</td>
                                    </tr>
                                ) : (
                                    commentReports.map((r) => (
                                        <tr key={r.reportId}>
                                            <td>댓글</td>
                                            <td>{r.reportTargetId}</td>
                                            <td>{r.reportReason}</td>
                                            <td>{r.userId}</td>
                                            <td>{r.reportedUserId ?? "-"}</td>
                                            <td>{r.reportStatus}</td>
                                            <td>
                                                <button className="reportmanagement_btn_">
                                                    댓글 정지
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}

export default ReportManagement;