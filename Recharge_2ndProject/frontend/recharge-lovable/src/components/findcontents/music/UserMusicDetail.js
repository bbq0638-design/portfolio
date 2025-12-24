import React, { useState, useEffect, useMemo } from "react";
import { FaStar, FaRegStar, FaPlay } from "react-icons/fa";
import { useParams } from "react-router-dom";
import "../../../css/findcontents/music/UserMusicDetail.css";
import axios from "axios";
import MusicPreview from "./MusicPreview";
import { useAuth } from "../../../context/AuthContext";
import PostComment from "../../community/PostComment";
import ReportModal from "../../modal/ReportModal";
import { submitReport } from "../../../api/ReportApi";

function UserMusicDetail() {
    const { userId, isLogin } = useAuth();
    const { postId } = useParams();

    const [previewTrack, setPreviewTrack] = useState(null);
    const [post, setPost] = useState(null);
    const [playlist, setPlaylist] = useState([]);
    const [loading, setLoading] = useState(true);

    // 신고 관련 state
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [reportTarget, setReportTarget] = useState({
        type: "music_post",
        id: null,
    });

    // axios instance
    const api = useMemo(
        () =>
            axios.create({
                baseURL: "/recharge/api",
                withCredentials: true,
            }),
        []
    );

    // 즐겨찾기 Map
    const [favoriteMap, setFavoriteMap] = useState({});

    // 현재 music_post의 고유 ID (댓글/신고/북마크 모두 여기를 사용)
    const musicPostKey = Number(post?.musicPostId ?? postId);

    // 즐겨찾기 토글
    const toggleFavorite = async (musicId) => {
        if (!isLogin) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            await api.post("/bookmark/toggle", {
                userId,
                bookmarkTargetId: Number(musicId),
                bookmarkTargetType: "MUSIC",
            });

            setFavoriteMap((prev) => {
                const next = { ...prev };
                next[musicId] = !prev[musicId];
                return next;
            });
        } catch (err) {
            console.error("북마크 토글 실패:", err);
        }
    };

    // 게시글 + 플레이리스트 로딩
    useEffect(() => {
        (async () => {
            try {
                const res = await api.get(`/musicpost/${postId}`);
                setPost(res.data.post);
                setPlaylist(res.data.playlist);

                if (isLogin) {
                    const favRes = await api.get(`/bookmark/music/${userId}`);

                    const map = {};
                    favRes.data.forEach((f) => {
                        map[Number(f.bookmarkTargetId)] = true;
                    });

                    setFavoriteMap(map);
                }
            } catch (err) {
                console.error(err);
                alert("게시글을 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        })();
    }, [api, postId, isLogin, userId]);

    // 신고 제출 처리
    const handleReportSubmit = async (reason) => {
        try {
            await submitReport({
                userId,
                reportTargetType: "music_post",
                reportTargetId: musicPostKey,
                reportReason: reason,
                createId: userId,
            });

            alert("신고가 접수되었습니다.");
            setIsReportOpen(false);
        } catch (err) {
            console.error("신고 실패:", err);
            alert("신고 처리 중 오류가 발생했습니다.");
        }
    };

    if (loading) return <div>불러오는 중...</div>;
    if (!post) return <div>존재하지 않는 게시글입니다.</div>;

    return (
        <div className="usermusicdetail_container">
            <div className="usermusicdetail_playlist">이용자 추천 플레이리스트</div>

            <div className="usermusicdetail_music">
                <ul className="usermusicdetail_music_lists">
                    {playlist.map((track) => {
                        const key = Number(track.musicId);

                        return (
                            <li key={key} className="usermusicdetail_music_list">
                                <button
                                    className={`usermusicdetail_addFavorite ${
                                        favoriteMap[key] ? "primary" : "outline"
                                    }`}
                                    onClick={() => toggleFavorite(key)}
                                >
                                    {favoriteMap[key] ? (
                                        <FaStar color="#F4C10F" />
                                    ) : (
                                        <FaRegStar />
                                    )}
                                </button>

                                <img
                                    src={
                                        track.musicImagePath ||
                                        "https://placehold.co/80x80?text=No+Image"
                                    }
                                    className="usermusicdetail_img"
                                    alt={track.musicTitle}
                                />

                                <div className="usermusicdetail_music_info">
                                    <span className="usermusicdetail_music_title">
                                        {track.musicTitle}
                                    </span>
                                    <span className="usermusicdetail_music_artist">
                                        {track.musicSinger}
                                    </span>

                                    <button
                                        className="usermusicdetail_preview_btn"
                                        onClick={() => setPreviewTrack(track)}
                                    >
                                        <FaPlay />
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* 게시글 본문 */}
            <div className="usermusicdetail_content">
                <div className="usermusicdetail_title">{post.musicPostTitle}</div>

                <div className="usermusicdetail_user">
                    <span>Recommended by </span>
                    <span>{post.userId}</span>
                </div>

                <div className="usermusicdetail_text">{post.musicPostText}</div>

                {/* 신고 버튼 */}
                {post.userId !== userId && (
                    <button
                        className="usermusicdetail_report_btn"
                        onClick={() => {
                            setReportTarget({
                                type: "music_post",
                                id: musicPostKey,
                            });
                            setIsReportOpen(true);
                        }}
                    >
                        신고하기
                    </button>
                )}
            </div>

            {/* 댓글 영역 */}
            <div className="usermusicdetail_comment">
                <div className="usermusicdetail_comment_title">Comments</div>
                <PostComment
                    targetType="music_post"
                    targetId={musicPostKey}
                />
            </div>

            {/* 신고 모달 */}
            <ReportModal
                isOpen={isReportOpen}
                onClose={() => setIsReportOpen(false)}
                onSubmit={handleReportSubmit}
                targetType="music_post"
            />

            {/* 음악 미리듣기 */}
            {previewTrack && (
                <MusicPreview
                    track={previewTrack}
                    onClose={() => setPreviewTrack(null)}
                />
            )}
        </div>
    );
}

export default UserMusicDetail;
