import React, { useEffect, useRef, useState } from "react";
import { FaPlay, FaPause, FaTimes } from "react-icons/fa";
import "../../../css/findcontents/music/MusicPreview.css";

function MusicPreview({ track, onClose }) {
    const audioRef = useRef(null);
    const [playing, setPlaying] = useState(true);
    const [progress, setProgress] = useState(0);

    // ✅ useEffect는 항상 최상단 (조건문보다 위)
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.play().catch(() => {});

        const timer = setInterval(() => {
            if (audio && audio.duration > 0) {
                setProgress((audio.currentTime / audio.duration) * 100);
            }
        }, 500);

        return () => {
            clearInterval(timer);
            if (audio) audio.pause();
        };
    }, [track]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (playing) audio.pause();
        else audio.play();
        setPlaying(!playing);
    };

    // ✅ 조건부 렌더링은 Hook 아래쪽에서 처리
    if (!track?.musicPreviewUrl) {
        return (
            <div className="musicpreview_bar no-preview">
                <img
                    src={track.musicImagePath || "https://placehold.co/60x60?text=No+Image"}
                    alt={track.musicTitle}
                />
                <div className="musicpreview_info">
                    <div className="musicpreview_title">{track.musicTitle}</div>
                    <div className="musicpreview_singer">{track.musicSinger}</div>
                    <div className="musicpreview_nourl">미리듣기를 지원하지 않습니다 🎧</div>
                </div>
                <button className="musicpreview_close" onClick={onClose}>
                    <FaTimes />
                </button>
            </div>
        );
    }

    return (
        <div className="musicpreview_bar">
            <img
                src={track.musicImagePath || "https://placehold.co/60x60?text=No+Image"}
                alt={track.musicTitle}
            />
            <div className="musicpreview_info">
                <div className="musicpreview_title">{track.musicTitle}</div>
                <div className="musicpreview_singer">{track.musicSinger}</div>
                <div className="musicpreview_progress">
                    <div
                        className="musicpreview_progress_inner"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            <div className="musicpreview_controls">
                <button onClick={togglePlay}>
                    {playing ? <FaPause /> : <FaPlay />}
                </button>
                <button onClick={onClose}>
                    <FaTimes />
                </button>
            </div>

            <audio ref={audioRef} src={track.musicPreviewUrl} />
        </div>
    );
}

export default MusicPreview;
