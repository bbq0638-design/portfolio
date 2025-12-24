import React, {useRef, useState, useEffect, useMemo} from "react";
import {Link} from 'react-router-dom';
import { FaFilm, FaMusic, FaStar, FaRegStar} from "react-icons/fa";
import '../../../css/findcontents/music/FindMusic.css'
import MusicRecommendAi from "./MusicRecommendAI";
import MusicPreview from "./MusicPreview";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext"; 


function FindMusic() {
    const {userId, isLogin} = useAuth();

    // axios instance
    const api = useMemo(
        () => axios.create({
            baseURL: "/recharge/api",
            withCredentials: true,
            headers: { "Content-Type": "application/json" }
    }),[]);

    const weatherRef = useRef(null);
    const userRef = useRef(null);

    // 고화질 앨범아트
    const getHighResArtwork = (url, size = 600) => {
        if (!url) return "https://placehold.co/600x600?text=No+Image";
        return url.replace(/\/\d+x\d+bb\.jpg$/, `/${size}x${size}bb.jpg`);
    };

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

    // 서버에서 가져온 즐겨찾기 목록 → Set
    const [favorites, setFavorites] = useState(new Set());

    // ⭐ 즐겨찾기 토글
    const toggleFavorite = async (musicId) => {
        if (!isLogin) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            await api.post(
                "/bookmark/toggle",
                {
                    userId: userId,
                    bookmarkTargetId: Number(musicId),
                    bookmarkTargetType: "MUSIC",
                }
            );

            setFavorites(prev => {
                const next = new Set(prev);
                const key = Number(musicId);
                if (next.has(key)) next.delete(key);
                else next.add(key);
                return next;
            });

        } catch (err) {
            console.error("북마크 토글 실패:", err);
        }
    };


    useEffect(() => {
        if (!isLogin) return;

        (async () => {
            try {
                const res = await api.get(`/bookmark/music/${userId}`);

                // 서버 구조에 맞게 bookmarkTargetId 사용
                const initial = new Set(res.data.map(f => Number(f.bookmarkTargetId)));

                setFavorites(initial);

            } catch (err) {
                console.error("초기 북마크 로딩 실패:", err);
            }
        })();
    }, [isLogin, userId, api]);

    const [openAi, setOpenAi] = useState(false);
    const [chart, setChart] = useState([]);
    const [userPosts, setUserPosts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [previewTrack, setPreviewTrack] = useState(null);

    // 음악 목록 로딩
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setError("");

                const [chartRes, userRes] = await Promise.all([
                    api.get("/music/chart/db"),  
                    api.get("/musicpost/list").catch(() => ({ data: [] }))
                ]);

                setChart(Array.isArray(chartRes.data) ? chartRes.data : []);
                setUserPosts(Array.isArray(userRes.data) ? userRes.data : []);

            } catch (e) {
                console.error(e);
                setError("음악 목록을 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        })();
    }, [api]);

    if (error) return <div className="error">{error}</div>;

    return(
        <div className="findcontents">
            <div className="findcontents_link">
                <button className="findcontents_btn">
                    <Link to="/find_contents/movie">
                        <div className="icon-wrap">
                            <FaFilm/>
                        </div>
                        <span>영화</span>
                    </Link>
                </button>
                <button className="findcontents_btn">
                    <Link to="/find_contents/music">
                        <div className="icon-wrap">
                            <FaMusic/>
                        </div>
                        <span>음악</span>
                    </Link>
                </button>
            </div>

            

            <div className="findcontents_recommendAi">
                <span>AI 기반 추천 음악 찾아보기</span>
                <button onClick={(e)=> {e.currentTarget.blur(); setOpenAi(true)}}>AI 추천으로 가기</button>
                <MusicRecommendAi open={openAi} onClose={() => setOpenAi(false)} />
            </div>

            {/* 인기 음악 섹션 */}
            <div className="findmusic_category">
                <div className="findmusic_category_title">인기 있는 음악</div>
            </div>

            <div className="findmusic_music">
                <div className="findmusic_slider_btn left">
                    <button onClick={() => scrollLeft(weatherRef, 300)}>⟨</button>
                </div>

                <ul className="findmusic_music_lists" ref={weatherRef}>
                    {loading && Array.from({ length: 8 }).map((_, idx) => (
                        <li className="findmusic_music_list" key={`skeleton-${idx}`}>
                            <div className="findmusic_weather_img" style={{ width: 180, height: 180, background: "#eee", borderRadius: 8 }} />
                        </li>
                    ))}

                    {!loading && chart.map((m, idx) => (
                        <li className="findmusic_music_list" key={m.musicId ?? idx}>
                            <img
                                src={getHighResArtwork(m.musicImagePath, 600)}
                                className="findmusic_weather_img"
                                alt={m.musicTitle}
                                loading="lazy"
                            />

                            {m.musicPreviewUrl && (
                                <div className="music_play_overlay" onClick={() => setPreviewTrack(m)}>▶</div>
                            )}

                            <button
                                className={`findmusic_fav_btn ${favorites.has(Number(m.musicId)) ? "primary" : "outline"}`}
                                onClick={() => toggleFavorite(m.musicId)}
                            >
                                {favorites.has(Number(m.musicId))
                                    ? <FaStar color="#F4C10F" />
                                    : <FaRegStar />}
                            </button>

                            <div className="findmusic_music_info">
                                <span title={m.musicTitle}>{m.musicTitle}</span>
                                <span title={m.musicSinger}>{m.musicSinger}</span>
                            </div>
                        </li>
                    ))}

                    {!loading && chart.length === 0 && (
                        <li className="findmusic_music_list" style={{ opacity: 0.7 }}>
                            표시할 음악이 없습니다.
                        </li>
                    )}
                </ul>

                <div className="findmusic_slider_btn right">
                    <button onClick={() => scrollRight(weatherRef, 300)}>⟩</button>
                </div>
            </div>

            {/* 회원 추천 음악 */}
            <div className="findmusic_category">
                <div className="findmusic_category_title">Re:Charge 회원들의 추천 음악</div>
                <div className="findmusic_category_addform">
                    <Link to="/find_contents/music/addmusic">추천 글쓰기 ›</Link>
                </div>
            </div>

            <div className="findmusic_music">
                <div className="findmusic_slider_btn left">
                    <button onClick={() => scrollLeft(userRef, 230)}>⟨</button>
                </div>

                <ul className="findmusic_music_lists" ref={userRef}>
                    {loading && Array.from({ length: 8 }).map((_, idx) => (
                        <li className="findmusic_music_list" key={`user-skeleton-${idx}`}>
                            <div className="findmusic_user_img" style={{ width: 180, height: 180, background: "#eee", borderRadius: 8 }} />
                        </li>
                    ))}

                    {!loading && userPosts.map((post) => {
                        const imagePath = post.firstImagePath || "https://placehold.co/180x180?text=No+Image";

                        return (
                            <li className="findmusic_music_list" key={post.musicPostId}>
                                <Link to={`/find_contents/music/usermusicdetail/${post.musicPostId}`} state={{ post }}>
                                    <img
                                        src={getHighResArtwork(imagePath, 600)}
                                        className="findmusic_user_img"
                                        alt={post.musicPostTitle}
                                        loading="lazy"
                                    />
                                    <div className="findmusic_music_info">
                                        <span title={post.musicPostTitle}>{post.musicPostTitle}</span>
                                        <span title={post.userId}>{post.userId}</span>
                                    </div>
                                </Link>
                            </li>
                        );
                    })}

                    {!loading && userPosts.length === 0 && (
                        <li className="findmusic_music_list" style={{ opacity: 0.7 }}>
                            표시할 추천 음악이 없습니다.
                        </li>
                    )}
                </ul>

                <div className="findmusic_slider_btn right">
                    <button onClick={() => scrollRight(userRef, 230)}>⟩</button>
                </div>
            </div>

            {previewTrack && (
                <MusicPreview track={previewTrack} onClose={() => setPreviewTrack(null)} />
            )}
        </div>
    );
}

export default FindMusic;
