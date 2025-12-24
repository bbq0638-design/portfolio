import React, {useState} from "react";
import axios from "axios";
import { FaStar} from "react-icons/fa";
import '../../../css/findcontents/movie/AddMovie.css'
import { useAuth } from "../../../context/AuthContext";

function AddMovie() {
    const {userId} = useAuth();


    const [movieTitle, setMovieTitle] = useState("");
    const [postTitle, setPostTitle] = useState("");
    const [content, setContent] = useState("");
    const [searchResult, setSearchResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!movieTitle.trim()) {
            alert("영화 제목을 입력하세요!");
            return;
        }
        try {
            setLoading(true);
            const res = await axios.get(`/recharge/api/moviepost/search`, {
                params: { query: movieTitle }
            });
            setSearchResult(res.data);
        } catch (err) {
            console.error(err);
            alert("영화 검색 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!searchResult || !postTitle.trim() || !content.trim()) {
            alert("모든 정보를 입력하세요!");
            return;
        }

        // ✅ 검색 결과에서 영화 세부정보까지 함께 저장
        const postData = {
            userId: userId, // 로그인 기능 붙으면 교체
            movieId: searchResult.tmdbId,
            moviePostTitle: postTitle,
            moviePostText: content,
            movieTitle: searchResult.title,
            moviePoster: searchResult.poster,
            movieDirector: searchResult.director,
            movieActor: searchResult.actor,
            movieGenre: searchResult.genre,
            movieScore: searchResult.score,
            movieReleaseDate: searchResult.releaseDate,
        };

        console.log("서버로 보낼 데이터 확인:", postData);

        try {
            const res = await axios.post(
                "/recharge/api/moviepost/add",
                postData,
                { withCredentials: true }
            );

            if (res.status === 200) {
                alert("추천 글이 등록되었습니다!");
                setPostTitle("");
                setContent("");
                setMovieTitle("");
                setSearchResult(null);
            }
        } catch (err) {
            console.error(err);
            alert("등록 중 오류가 발생했습니다.");
        }
    };

    return(
        <div className="addmovie_container">
            <div className="addmovie_header">
                <h2>영화 추천 글 작성하기</h2>
            </div>
            <div className="addmovie_addform">
                <div className="addmovie_search">
                    <input
                        type="text"
                        placeholder="영화 제목을 입력하세요"
                        value={movieTitle}
                        onChange={(e) => setMovieTitle(e.target.value)}
                    />
                    <button onClick={handleSearch}>검색</button>
                </div>

                {loading && <p>검색 중...</p>}
                {searchResult && (
                <div className="addmovie_searched_movie">
                    <div className="addmovie_poster">
                        <img src={searchResult.poster || "https://placehold.co/185x278?text=poster"} alt="포스터" />
                    </div>
                    <div className="addmovie_meta">
                        <div className="addmovie_title">{searchResult.title}</div>
                        <div className="addmovie_meta_row">
                            <span className="addmovie_meta_chip"><span>🎬</span> <span>{searchResult.genre || "장르 정보 없음"}</span></span>
                            <span className="addmovie_meta_chip"><span>📅</span> <span>{searchResult.releaseDate || "개봉일 없음"}</span></span>
                            <span className="addmovie_meta_chip"><FaStar color="#F4C10F"/> {searchResult.score || "N/A"}</span>
                            <span className="addmovie_meta_chip"><strong>감독</strong><span>{searchResult.director || "정보 없음"}</span></span>
                            <span className="addmovie_meta_chip"><strong>출연</strong><span>{searchResult.actor || "정보 없음"}</span></span>
                        </div>
                    </div>
                </div>
                )}
                <div className="addmovie_content_title">
                    <span>게시글 제목</span>
                     <input
                        type="text"
                        placeholder="추천 글 제목을 입력하세요"
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                    />
                </div>
                <div className="addmovie_content_text">
                    <span>추천 이유</span>
                    <textarea
                        placeholder="영화 추천 상세 내용"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                <div className="addmovie_content_btn">
                    <button onClick={handleSubmit}>등록하기</button>
                </div>
            </div>
        </div>
    );
}

export default AddMovie;