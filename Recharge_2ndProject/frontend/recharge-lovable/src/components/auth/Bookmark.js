import React, { useMemo, useState, useEffect } from "react";
import '../../css/auth/Bookmark.css';
import { FaStar } from "react-icons/fa";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import MusicPreview from "../findcontents/music/MusicPreview";

function Bookmark() {

    const { userId, isLogin } = useAuth();
    const [previewTrack, setPreviewTrack] = useState(null);

    const api = useMemo(
        () =>
            axios.create({
                baseURL: "/recharge/api",
                withCredentials: true,
            }),
        []
    );

    // 🎬 영화 + 영화게시글 통합 저장
    const [movieBookmarks, setMovieBookmarks] = useState([]);

    // 🎵 음악 북마크
    const [musicBookmarks, setMusicBookmarks] = useState([]);

    /** 🎵 고화질 앨범아트 변환 */
    const getHighResArtwork = (url, size = 600) => {
        if (!url) return "https://placehold.co/600x600?text=No+Image";
        return url.replace(/\/\d+x\d+bb\.jpg$/, `/${size}x${size}bb.jpg`);
    };

    /** 🎬 TMDB 이미지 변환 */
    const tmdbImage = (path) =>
        path && !path.startsWith("http")
            ? `https://image.tmdb.org/t/p/w500${path}`
            : path || "https://placehold.co/200x300?text=No+Image";

    /** ⭐ bookmark 목록 로딩 */
    useEffect(() => {
        if (!isLogin) return;

        (async () => {
            try {
                // 🎬 영화 북마크
                const movieRes = await api.get(`/bookmark/movie/${userId}`);

                // 📝 영화게시글 북마크
                const postRes = await api.get(`/bookmark/moviepost/${userId}`);

                // ⭐ 두 목록을 하나로 합침
                const mergedMovieList = [
                    ...movieRes.data.map(m => ({
                        ...m,
                        type: "MOVIE"
                    })),
                    ...postRes.data.map(p => ({
                        ...p,
                        type: "MOVIE_POST"
                    }))
                ];

                setMovieBookmarks(mergedMovieList);

                // 🎵 음악 북마크
                const musicRes = await api.get(`/bookmark/music/${userId}`);
                setMusicBookmarks(musicRes.data);

            } catch (err) {
                console.error("북마크 목록 로딩 실패:", err);
            }
        })();
    }, [api, userId, isLogin]);

    /** ⭐ 즐겨찾기 해제 */
    const toggleFavorite = async (targetId, type) => {
        try {
            await api.post("/bookmark/toggle", {
                userId,
                bookmarkTargetId: Number(targetId),
                bookmarkTargetType: type,
            });

            // 🎬 영화 + 영화게시글 제거
            if (type === "MOVIE" || type === "MOVIE_POST") {
                setMovieBookmarks(prev =>
                    prev.filter(m =>
                        !(
                            (m.type === type) &&
                            (
                                (m.type === "MOVIE" && m.movieId === Number(targetId)) ||
                                (m.type === "MOVIE_POST" && m.moviePostId === Number(targetId))
                            )
                        )
                    )
                );
            }

            // 🎵 음악 제거
            if (type === "MUSIC") {
                setMusicBookmarks(prev =>
                    prev.filter(m => m.bookmarkTargetId !== Number(targetId))
                );
            }
        } catch (err) {
            console.error("즐겨찾기 해제 실패:", err);
        }
    };

    return (
        <div className="Bookmark_main">
            <div className="Bookmark_title">
                <h2>내가 찜한 콘텐츠</h2>
            </div>

            {/* 카테고리 탭 */}
            <Tabs defaultValue="movie" className="Bookmark_box">
                <TabsList className="Bookmark_category">
                    <TabsTrigger value="movie" className="Bookmark_category_btn1">
                        Movie({movieBookmarks.length})
                    </TabsTrigger>
                    <TabsTrigger value="music" className="Bookmark_category_btn2">
                        Music({musicBookmarks.length})
                    </TabsTrigger>
                </TabsList>

                {/* 🎬 Movies (영화 + 영화게시글 섞어서) */}
                <TabsContent value="movie">
                    <div className="Bookmark_list_container">

                        {movieBookmarks.length === 0 && (
                            <div style={{ padding: "40px", textAlign: "center", width: "100%" }}>
                                찜한 영화가 없습니다.
                            </div>
                        )}

                        {movieBookmarks.map(item => (
                            <div key={item.bookmarkId} className="Bookmark_list_card">

                                {/* 이동 URL은 type에 따라 달라짐 */}
                                <div className="Bookmark_img">
                                    <Link
                                        to={
                                            item.type === "MOVIE"
                                                ? `/find_contents/movie/${item.movieId}`
                                                : `/find_contents/movie/posts/${item.moviePostId}`
                                        }
                                    >
                                        <img
                                            src={tmdbImage(item.poster)}
                                            alt="movie"
                                            style={{ width: "100%", borderRadius: "10px" }}
                                        />
                                    </Link>
                                </div>

                                {/* 즐겨찾기 해제 */}
                                <button
                                    className="Bookmark_like_btn"
                                    onClick={() =>
                                        toggleFavorite(
                                            item.type === "MOVIE"
                                                ? item.movieId
                                                : item.moviePostId,
                                            item.type
                                        )
                                    }
                                >
                                    <FaStar className="star" />
                                </button>

                                <div className="Bookmark_movie_title">
                                    {item.title || "제목 없음"}
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                {/* 🎵 Music */}
                <TabsContent value="music">
                    <div className="Bookmark_list_container">

                        {musicBookmarks.length === 0 && (
                            <div style={{ padding: "40px", textAlign: "center", width: "100%" }}>
                                찜한 음악이 없습니다.
                            </div>
                        )}

                        {musicBookmarks.map(item => (
                            <div key={item.bookmarkId} className="Bookmark_list_card_music">

                                {/* 앨범 이미지 + 미리듣기 */}
                                <div className="Bookmark_img_music">
                                    <img
                                        src={getHighResArtwork(item.albumArt, 600)}
                                        alt="music"
                                        style={{ width: "100%", borderRadius: "8px" }}
                                    />

                                    {item.musicPreviewUrl && (
                                        <div
                                            className="Bookmark_music_play_overlay"
                                            onClick={() => setPreviewTrack(item)}
                                        >
                                            ▶
                                        </div>
                                    )}
                                </div>

                                {/* 즐겨찾기 해제 */}
                                <button
                                    className="Bookmark_like_btn"
                                    onClick={() => toggleFavorite(item.bookmarkTargetId, "MUSIC")}
                                >
                                    <FaStar className="star" />
                                </button>

                                <div className="Bookmark_movie_title">
                                    {item.title || "제목 없음"}
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            {/* 음악 미리듣기 */}
            {previewTrack && (
                <MusicPreview track={previewTrack} onClose={() => setPreviewTrack(null)} />
            )}
        </div>
    );
}

export default Bookmark;
