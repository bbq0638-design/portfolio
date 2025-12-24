import React, { useState, useEffect, useMemo } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { FaStar, FaRegStar, FaYoutube } from "react-icons/fa";
import "../../../css/findcontents/movie/MovieDetail.css";
import { useAuth } from "../../../context/AuthContext";
import PostComment from "../../community/PostComment";

function MovieDetail() {
    const { movieId } = useParams();
    const location = useLocation();
    const initialMovie = location.state?.movie || null;

    const { userId, isLogin } = useAuth();

    const [movie, setMovie] = useState(initialMovie);
    const [loading, setLoading] = useState(!initialMovie);
    const [error, setError] = useState("");

    // 즐겨찾기 여부 저장 객체
    const [favoriteMap, setFavoriteMap] = useState({});

    const api = useMemo(
        () =>
            axios.create({
                baseURL: "/recharge/api",
                withCredentials: true,
            }),
        []
    );

    const tmdb = {
        poster: (path, size = "w500") =>
            path
                ? path.startsWith("http")
                    ? path
                    : `https://image.tmdb.org/t/p/${size}${path}`
                : "https://placehold.co/300x450?text=No+Image",
    };

    /** 1️⃣ 영화 상세 정보 로딩 */
    useEffect(() => {
        if (movie !== null) return;

        (async () => {
            try {
                setLoading(true);
                const res = await api.get(`/movies/${movieId}`);
                setMovie(res.data);
            } catch (err) {
                console.error("영화 정보 로딩 실패:", err);
                setError("영화 정보를 불러올 수 없습니다.");
            } finally {
                setLoading(false);
            }
        })();
    }, [api, movieId, movie]);

    useEffect(() => {
        if (!isLogin) return;

        (async () => {
            try {
                const res = await api.get(`/bookmark/movie/${userId}`);

                const map = {};
                res.data.forEach(b => {
                    if (b.bookmarkTargetId) {
                        map[b.bookmarkTargetId] = true;
                    }
                });

                setFavoriteMap(map);
            } catch (err) {
                console.error("즐겨찾기 목록 로딩 실패:", err);
            }
        })();
    }, [api, userId, isLogin]);

    /** ⭐ 현재 영화 즐겨찾기 여부 */
    const isFavorite = !!favoriteMap[movieId];

    /** 3️⃣ 즐겨찾기 토글 */
    const toggleFavorite = async () => {
        if (!isLogin) {
            alert("로그인 후 이용 가능합니다.");
            return;
        }

        try {
            await api.post("/bookmark/toggle", {
                userId,
                bookmarkTargetId: Number(movieId), 
                bookmarkTargetType: "MOVIE",
            });

            // 화면 즉시 반영
            setFavoriteMap(prev => {
                const next = { ...prev };
                if (next[movieId]) {
                    delete next[movieId];
                } else {
                    next[movieId] = true;
                }
                return next;
            });
        } catch (err) {
            console.error("즐겨찾기 토글 실패:", err);
        }
    };

    if (loading)
        return <div className="moviedetail_container">불러오는 중...</div>;

    if (error || !movie)
        return <div className="moviedetail_container">{error}</div>;

    // 안전 처리된 데이터
    const posterUrl = tmdb.poster(movie.poster);
    const title = movie.title;
    const score = movie.score ?? "-";
    const genre = movie.genreName || "장르 미지정";
    const director = movie.director || "-";
    const actor = movie.actor || "-";
    const comment = movie.comment || "줄거리 정보가 없습니다.";
    const releaseDate = movie.releaseDate || "-";

    return (
        <div className="moviedetail_container">

            {/* 영화 정보 */}
            <div className="moviedetail_movie">
                <div className="moviedetail_movie_poster">
                    <img src={posterUrl} alt={title} className="findcontents_main_img" />
                </div>

                <div className="moviedetail_movie_info">
                    <div className="moviedetail_movie_info_title">{title}</div>

                    <div className="moviedetail_movie_info_meta">
                        <div className="moviedetail_movie_info_meta_row1">
                            <span className="moviedetail_movie_info_meta_chip1">
                                <FaStar color="#F4C10F" /> {score}
                            </span>
                            <span className="moviedetail_movie_info_meta_chip1">
                                🎬 {genre}
                            </span>
                            <span className="moviedetail_movie_info_meta_chip1">
                                📅 {releaseDate}
                            </span>
                        </div>

                        <div className="moviedetail_movie_info_meta_row2">
                            <span className="moviedetail_movie_info_meta_chip2">
                                <strong>감독:</strong> {director}
                            </span>
                            <span className="moviedetail_movie_info_meta_chip2">
                                <strong>출연:</strong> {actor}
                            </span>
                        </div>

                        <div className="moviedetail_movie_info_meta_row3">
                            {comment}
                        </div>

                        {/* ⭐ 즐겨찾기 버튼 */}
                        <div className="moviedetail_movie_info_meta_favorite">
                            <button
                                className={`moviedetail_addFavorite ${
                                    isFavorite ? "primary" : "outline"
                                }`}
                                onClick={toggleFavorite}
                            >
                                {isFavorite ? <FaStar color="#F4C10F" /> : <FaRegStar />}
                                <span>{isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}</span>
                            </button>

                            <a
                                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                                    `${title} trailer`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="moviedetail_goTrailer"
                            >
                                <FaYoutube />
                                <span>트레일러 보러가기</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* 댓글 영역 */}
            <div className="moviedetail_comment">
            <PostComment targetType="movie" targetId={movieId} />
            </div>

            {/* 목록으로 */}
            <div className="moviedetail_back">
                <Link to="/find_contents/movie">목록으로 돌아가기 ›</Link>
            </div>
        </div>
    );
}

export default MovieDetail;
