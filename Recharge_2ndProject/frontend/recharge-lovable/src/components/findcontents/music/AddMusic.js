import React, { useState } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import "../../../css/findcontents/music/AddMusic.css";
import { useAuth } from "../../../context/AuthContext"; 

function AddMusic() {
    
    const {userId, isLogin} = useAuth();

    const api = axios.create({
        baseURL: "/recharge/api",
        withCredentials: true,
    });

    const getHighResArtwork = (url, size = 600) =>
        url
            ? url.replace(/\/\d+x\d+bb\.jpg$/, `/${size}x${size}bb.jpg`)
            : "https://placehold.co/600x600?text=No+Image";

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [playlist, setPlaylist] = useState([]);
    const [postTitle, setPostTitle] = useState("");
    const [postText, setPostText] = useState("");
    const [loading, setLoading] = useState(false);

    // iTunes DB 검색
    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            alert("노래 제목을 입력하세요!");
            return;
        }
        setLoading(true);
        try {
            const res = await api.get("/music/search/itunes", {
                params: { term: searchTerm, limit: 5 },
            });
            setSearchResults(res.data);
        } catch (err) {
            console.error(err);
            alert("검색 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    //  플레이리스트 추가
    const addToPlaylist = (music) => {
        if (playlist.some((item) => item.musicId === music.musicId)) {
            alert("이미 추가된 곡입니다!");
            return;
        }
        setPlaylist([...playlist, music]);
    };

    //  플레이리스트 제거
    const removeFromPlaylist = (musicId) => {
        setPlaylist(playlist.filter((m) => m.musicId !== musicId));
    };

    // 📝 게시글 + 플레이리스트 저장
    const handleSubmit = async () => {

        if(!isLogin) {
            alert("로그인이 필요합니다");
            return;
        }

        if (!postTitle.trim()) {
            alert("게시글 제목을 입력하세요!");
            return;
        }
        if (playlist.length === 0) {
            alert("최소 한 곡 이상 선택해주세요!");
            return;
        }

        const payload = {
            userId: userId,
            title: postTitle,
            content: postText,
            playlist: playlist.map((m) => ({
                musicId: m.musicId,
                musicTitle: m.musicTitle,
                musicSinger: m.musicSinger,
                musicImagePath: m.musicImagePath,
                musicPreviewUrl: m.musicPreviewUrl ?? null,
            })),
        };

        try {
            const res = await api.post("/musicpost/add", payload);
            alert("음악 추천글이 등록되었습니다");
            console.log("등록 결과:", res.data);

            
            setPostTitle("");
            setPostText("");
            setPlaylist([]);
        } catch (err) {
            console.error(err);
            alert("등록 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="addmusic_container">
            <div className="addmusic_header">
                <h2>음악 추천 글 작성하기</h2>
            </div>

            <div className="addmusic_addform">
                {/*  검색 영역 */}
                <div className="addmusic_search">
                    <input
                        type="text"
                        placeholder="노래 제목을 입력하세요"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button onClick={handleSearch} disabled={loading}>
                        {loading ? "검색 중..." : "검색"}
                    </button>
                </div>

                {/*  검색 결과 */}
                {searchResults.length > 0 && (
                    <ul className="addmusic_music_lists">
                        {searchResults.map((m) => (
                            <li key={m.musicId} className="addmusic_music_list">
                                <img
                                    src={getHighResArtwork(m.musicImagePath)}
                                    alt={m.musicTitle}
                                    className="addmusic_img"
                                />
                                <div className="addmusic_music_info">
                                    <span className="addmusic_music_title">{m.musicTitle}</span>
                                    <span className="addmusic_music_artist">{m.musicSinger}</span>
                                </div>
                                <button
                                    className="addmusic_add_btn"
                                    onClick={() => addToPlaylist(m)}
                                >
                                    <FaPlus /> 추가
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {/* 🎧 플레이리스트 */}
                <div className="addmusic_content_text">
                    <span>추가한 플레이리스트</span>
                </div>
                {playlist.length > 0 && (
                    <div className="addmusic_music">
                        <ul className="addmusic_music_lists">
                            {playlist.map((m) => (
                                <li key={m.musicId} className="addmusic_music_list">
                                    <img
                                        src={getHighResArtwork(m.musicImagePath, 180)}
                                        alt={m.musicTitle}
                                        className="addmusic_img"
                                    />
                                    <div className="addmusic_music_info">
                                        <span className="addmusic_music_title">{m.musicTitle}</span>
                                        <span className="addmusic_music_artist">{m.musicSinger}</span>
                                    </div>
                                    <button
                                        className="addmusic_remove_btn"
                                        onClick={() => removeFromPlaylist(m.musicId)}
                                    >
                                        ✕
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/*  게시글 작성 영역 */}
                <div className="addmusic_content_title">
                    <span>게시글 제목</span>
                    <input
                        type="text"
                        placeholder="추천 글 제목을 입력하세요"
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                    />
                </div>

                <div className="addmusic_content_text">
                    <span>추천 이유</span>
                    <textarea
                        placeholder="추천 이유를 입력하세요"
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                    />
                </div>

                <div className="addmusic_content_btn">
                    <button onClick={handleSubmit}>등록하기</button>
                </div>
            </div>
        </div>
    );
}

export default AddMusic;
