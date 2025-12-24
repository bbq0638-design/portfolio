import React, { useState } from "react";
import Modal from "react-modal";
import { FaTimes, FaCloudSun, FaSmile, FaStar, FaRegStar } from "react-icons/fa";
import "../../../css/findcontents/music/MusicRecommendAi.css";

Modal.setAppElement("#root");

function MusicRecommendAi({ open, onClose }) {
    const [mode, setMode] = useState("weather");
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);

    const placeholder =
        mode === "weather"
            ? "예) 지금 날씨(맑음/비/눈/흐림)와 어울리는 음악을 추천해줘"
            : "예) 지금 기분이 좋아요. 행복한 기분과 어울리는 음악을 추천해줘";

    const mockResults = [
        { id: "1", img: "https://placehold.co/180x180?text=1", title: "Sunbeam Drive", artist: "Nova Lines", isFavorite: false },
        { id: "2", img: "https://placehold.co/180x180?text=2", title: "Blue Umbrella", artist: "City Rain", isFavorite: false },
        { id: "3", img: "https://placehold.co/180x180?text=3", title: "Snow Way Home", artist: "Polar Keys", isFavorite: false },
        { id: "4", img: "https://placehold.co/180x180?text=4", title: "Cloud Pillow", artist: "Hush & Haze", isFavorite: false },
        { id: "5", img: "https://placehold.co/180x180?text=4", title: "Cloud Pillow", artist: "Hush & Haze", isFavorite: false },
        { id: "6", img: "https://placehold.co/180x180?text=4", title: "Cloud Pillow", artist: "Hush & Haze", isFavorite: false },
        { id: "7", img: "https://placehold.co/180x180?text=4", title: "Cloud Pillow", artist: "Hush & Haze", isFavorite: false },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setItems(mockResults);
            setLoading(false);
        }, 500);
    };

    const toggleFavorite = (id) => {
        setItems((prev) =>
            prev.map((it) => (it.id === id ? { ...it, isFavorite: !it.isFavorite } : it))
        );
    };

    return (
        <Modal
            isOpen={open}
            onRequestClose={onClose}
            shouldCloseOnOverlayClick={false}
            shouldCloseOnEsc={false}
            className="airprompt_modal"
            overlayClassName="airprompt_overlay"
            contentLabel="AI 음악 추천"
        >
            <div className="airprompt_header">
                <h2>AI 음악 추천</h2>
                <button
                    type="button"
                    className="airprompt_icon_btn"
                    aria-label="닫기"
                    tabIndex="-1"
                    onClick={onClose}
                >
                    <FaTimes />
                </button>
            </div>

            <div className="airprompt_tabs" role="tablist" aria-label="추천 기준 전환">
                <button
                    role="tab"
                    aria-selected={mode === "weather"}
                    className={`airprompt_tab ${mode === "weather" ? "active" : ""}`}
                    onClick={() => setMode("weather")}
                >
                    <FaCloudSun className="airprompt_tab_icon" />
                    날씨
                </button>
                <button
                    role="tab"
                    aria-selected={mode === "mood"}
                    className={`airprompt_tab ${mode === "mood" ? "active" : ""}`}
                    onClick={() => setMode("mood")}
                >
                    <FaSmile className="airprompt_tab_icon" />
                    기분
                </button>
            </div>

            <form className="airprompt_form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="airprompt_input"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    type="submit"
                    className="airprompt_submit"
                    disabled={loading || !query.trim()}
                >
                    {loading ? "분석 중..." : "추천받기"}
                </button>
            </form>

            <div className="airprompt_results">
                <ul className="airprompt_music_lists">
                    {items.map((it) => (
                        <li className="airprompt_music_list" key={it.id}>
                            <img src={it.img} alt="앨범 커버" className="airprompt_cover_img" />
                            <button
                                className={`airprompt_fav_btn ${it.isFavorite ? "primary" : "outline"}`}
                                onClick={() => toggleFavorite(it.id)}
                                aria-label={it.isFavorite ? "즐겨찾기 제거" : "즐겨찾기 추가"}
                                title={it.isFavorite ? "즐겨찾기 제거" : "즐겨찾기 추가"}
                            >
                                {it.isFavorite ? <FaStar color="#f4c10f" /> : <FaRegStar />}
                            </button>
                            <div className="airprompt_music_info">
                                <span className="airprompt_title">{it.title}</span>
                                <span className="airprompt_artist">{it.artist}</span>
                            </div>
                        </li>
                    ))}
                    {!loading && items.length === 0 && (
                        <li className="airprompt_empty">추천 결과를 찾을 수 없습니다.</li>
                    )}
                </ul>
            </div>
        </Modal>
    );
}

export default MusicRecommendAi;
