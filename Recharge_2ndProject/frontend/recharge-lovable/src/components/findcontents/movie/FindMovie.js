// src/components/findcontents/movie/FindMovie.js
import React, {useRef, useState, useEffect} from "react";
import {Link} from 'react-router-dom';
import { FaFilm, FaMusic} from "react-icons/fa";
import '../../../css/findcontents/movie/FindMovie.css'
import MovieRecommendAi from "./MovieRecommendAi";
import axios from "axios";

function FindMovie() {
    // 백엔드: server.servlet.context-path=/recharge, @RequestMapping("/api")
    const api = axios.create({
        baseURL: "/recharge/api"
    });

    const weatherRef = useRef(null);
    const userRef = useRef(null);
    const [openAi, setOpenAi] = useState(false);

    // 최신(메인 백드롭), 인기(가로리스트), 사용자 게시글(옵션)
    const [latest, setLatest] = useState([]);
    const [movies, setMovies] = useState([]);
    const [userPosts, setUserPosts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // 이미지 빌더: TMDB path면 베이스 붙이고, 아니면 그대로 사용
    const tmdb = {
        poster: (path, size = "w780") =>
            path
                ? (path.startsWith("http") ? path : `https://image.tmdb.org/t/p/${size}${path}`)
                : "https://placehold.co/185x278?text=No+Image",
        backdrop: (path, size = "original") =>
            path
                ? (path.startsWith("http") ? path : `https://image.tmdb.org/t/p/${size}${path}`)
                : "https://placehold.co/1075x576?text=No+Image",
        card: (path, size = "w1280") =>
            path
                ? (path.startsWith("http") ? path : `https://image.tmdb.org/t/p/${size}${path}`)
                : "https://placehold.co/300x180?text=No+Image",
    };

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setError("");

                // 백엔드에 있는 두 엔드포인트만 확실하게 호출
                const [latestRes, popularRes] = await Promise.all([
                    api.get("/movies", { params: { page: 1, size: 5,  sort: "latest"  }}),
                    api.get("/movies", { params: { page: 1, size: 16, sort: "popular" }}),
                ]);

                setLatest(Array.isArray(latestRes.data) ? latestRes.data : []);
                setMovies(Array.isArray(popularRes.data) ? popularRes.data : []);

                // (옵션) 게시글 API가 아직 없으면 404 → 조용히 무시
                try {
                    const postRes = await api.get("/moviepost/list", { params: { page: 1, size: 16 }});
                    setUserPosts(Array.isArray(postRes.data) ? postRes.data : []);
                } catch {
                    setUserPosts([]); // 엔드포인트 미구현 시 비워둠
                }
            } catch (e) {
                console.error(e);
                setError("목록을 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // 가로 스크롤(기존 함수/동작 유지)
    const getScroll = (ref, fallback = 240) => {
        const track = ref.current;
        if (!track) return 0;
        const first = track.firstElementChild;
        const width = first ? first.getBoundingClientRect().width : fallback;
        const styles = getComputedStyle(track);
        const gap = parseFloat(styles.columnGap || styles.gap || "16");
        return width + gap;
    };

    const scrollLeft  = (ref, fallback) => ref.current?.scrollBy({ left: -getScroll(ref, fallback), behavior: "smooth" });
    const scrollRight = (ref, fallback) => ref.current?.scrollBy({ left:  getScroll(ref, fallback), behavior: "smooth" });

    if (error) return <div className="error">{error}</div>;

    return(
        <div className="findcontents">
            <div className="findcontents_link">
                <button className="findcontents_btn">
                    <Link to="/find_contents/movie">
                        <div className="icon-wrap"><FaFilm/></div>
                        <span>영화</span>
                    </Link>
                </button>
                <button className="findcontents_btn">
                    <Link to="/find_contents/music">
                        <div className="icon-wrap"><FaMusic/></div>
                        <span>음악</span>
                    </Link>
                </button>
            </div>

            <div className="findmovie_main">
                {loading ? (
                    <img src="https://placehold.co/1025x576?text=Loading..." className="findmovie_main_img" alt="로딩중" />
                ) : latest.length > 0 ? (
                    <Link to={`/find_contents/movie/${latest[0]?.movieId ?? ""}`} state={{ movie: latest[0] }}>
                        <img
                            src={tmdb.backdrop(latest[0]?.backdrop, "original")}
                            className="findmovie_main_img"
                            alt={latest[0]?.title ?? "백드롭 이미지"}
                            loading="lazy"
                        />
                    </Link>
                ) : (
                    <img src="https://placehold.co/1025x576?text=No+Data" className="findmovie_main_img" alt="빈화면"/>
                )}
            </div>

            <div className="findcontents_recommendAi">
                <span>AI 기반 추천 영화 찾아보기</span>
                <button onClick={(e) => { e.currentTarget.blur(); setOpenAi(true); }}>AI 추천으로 가기</button>
                <MovieRecommendAi open={openAi} onClose={() => setOpenAi(false)} />
            </div>

            <div className="findmovie_select_genre">
                {["액션", "코미디", "가족", "판타지", "공포", "로맨스", "SF", "스릴러"].map(g => (
                    <label key={g}>
                        <input type="checkbox" name="movie_genre" />
                        {g}
                    </label>
                ))}
            </div>

            {/* 현재 인기 있는 영화 */}
            <div className="findmovie_category">
                <div className="findmovie_category_title">현재 인기 있는 영화</div>
            </div>
            <div className="findmovie_weather_movie">
                <div className="findmovie_slider_btn left">
                    <button onClick={() => scrollLeft(weatherRef, 300)}>⟨</button>
                </div>
                <ul className="findmovie_weather_movie_lists" ref={weatherRef}>
                    {movies.map((m, idx) => (
                        <li className="findmovie_weather_movie_list" key={m?.movieId ?? idx}>
                            <Link to={`/find_contents/movie/${m?.movieId ?? ""}`} state={{ movie: m }}>
                                <img
                                    src={tmdb.card(m?.poster, "original")}
                                    className="findmovie_weather_img"
                                    alt={m?.title ?? "포스터"}
                                    loading="lazy"
                                />
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className="findmovie_slider_btn right">
                    <button onClick={() => scrollRight(weatherRef, 300)}>⟩</button>
                </div>
            </div>

            <div className="findmovie_category">
                <div className="findmovie_category_title">Re:Charge 회원들의 추천 영화</div>
                <div className="findmovie_category_addform">
                    <Link to="/find_contents/movie/addmovie">추천 글쓰기 ›</Link>
                </div>
            </div>

            <div className="findmovie_user_movie">
                <div className="findmovie_slider_btn left">
                    <button onClick={() => scrollLeft(userRef, 230)}>⟨</button>
                </div>

                <ul className="findmovie_user_movie_lists" ref={userRef}>
                    {userPosts.map((p, idx) => (
                        <li className="findmovie_user_movie_list" key={p.moviePostId ?? idx}>
                            <Link
                                to={`/find_contents/movie/posts/${p.moviePostId ?? ""}`}
                                state={{ post: p }}
                            >
                                <img
                                    src={
                                        p.poster
                                            ? (p.poster.startsWith("http")
                                                ? p.poster
                                                : `https://image.tmdb.org/t/p/w500${p.poster}`)
                                            : "https://placehold.co/185x278?text=No+Image"
                                    }
                                    alt={p.moviePostTitle ?? "추천글 포스터"}
                                    className="findmovie_user_img"
                                    loading="lazy"
                                />
                                <div className="findmovie_user_movie_info">
                                    <span>{p.moviePostTitle ?? "글 제목"}</span>
                                    <span>{p.userId ?? "작성자"}</span>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="findmovie_slider_btn right">
                    <button onClick={() => scrollRight(userRef, 230)}>⟩</button>
                </div>
            </div>
        </div>
    );
}

export default FindMovie;
