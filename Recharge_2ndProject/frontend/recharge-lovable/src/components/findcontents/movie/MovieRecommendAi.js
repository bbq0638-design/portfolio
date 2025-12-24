import React, { useState } from "react";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import { FaTimes, FaCloudSun, FaSmile} from "react-icons/fa";
import "../../../css/findcontents/movie/MovieRecommendAi.css";

Modal.setAppElement("#root");

function MovieRecommendAi({ open, onClose }) {
    const [mode, setMode] = useState("weather");
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);

    const placeholder =
        mode === "weather"
            ? "예) 맑은 날씨에 어울리는 영화를 추천해줘"
            : "예) 기분이 좋은 날 볼만한 영화를 추천해줘";

    const mockResults = [
        { id: "1", img: "https://placehold.co/185x278?text=1" },
        { id: "2", img: "https://placehold.co/185x278?text=2" },
        { id: "3", img: "https://placehold.co/185x278?text=3" },
        { id: "4", img: "https://placehold.co/185x278?text=4" },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);
        setTimeout(() => {
            setItems(mockResults);
            setLoading(false);
        }, 500);
    };

    return (
        <Modal
            isOpen={open}
            onRequestClose={onClose}
            shouldCloseOnOverlayClick={false}
            shouldCloseOnEsc={false}
            className="airprompt_modal"
            overlayClassName="airprompt_overlay"
            contentLabel="AI 영화 추천"
        >
            <div className="airprompt_header">
                <h2>AI 영화 추천</h2>
                <button type="button" className="airprompt_icon_btn" aria-label="닫기" onClick={onClose}>
                    <FaTimes />
                </button>
            </div>

            <div className="airprompt_tabs">
                <button
                    className={`airprompt_tab ${mode === "weather" ? "active" : ""}`}
                    onClick={() => setMode("weather")}
                >
                    <FaCloudSun className="airprompt_tab_icon" />
                    날씨
                </button>
                <button
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
                <button type="submit" className="airprompt_submit" disabled={loading || !query.trim()}>
                    {loading ? "분석 중..." : "추천받기"}
                </button>
            </form>

            <div className="airprompt_results">
                <ul className="airprompt_movie_lists">
                    {items.map((it) => (
                        <li className="airprompt_movie_card" key={it.id}>
                            <Link to="/find_contents/movie/usermoviedetail" className="airprompt_movie_link">
                                <img src={it.img} alt="포스터" className="airprompt_movie_img" />
                            </Link>
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

export default MovieRecommendAi;
