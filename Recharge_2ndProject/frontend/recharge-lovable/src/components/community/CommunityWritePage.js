import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../../css/community/Community.css";
import { useAuth } from "../../context/AuthContext"; 

function CommunityWritePage() {
  const navigate = useNavigate();
  const { id } = useParams(); // URL에서 게시글 ID 가져오기
  const isEditMode = !!id; // ID가 있으면 수정 모드

  // 로그인한 사용자 (실제로는 AuthContext에서 가져오기)
   const {userId , isLogin} = useAuth(); 

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [communityTab, setCommunityTab] = useState("review");
  const [existingImagePath, setExistingImagePath] = useState(null); // 기존 이미지 경로
  const [deleteImage, setDeleteImage] = useState(false); // 이미지 삭제 플래그
  const [loading, setLoading] = useState(false);

  const tabs = [
    { key: "review", label: "충전소 이용후기 & 경험" },
    { key: "tips", label: "전기차 꿀팁 & 사용정보" },
    { key: "safety", label: "안전·사고 대처" },
  ];

  // ✅ 수정 모드일 때 기존 게시글 데이터 불러오기
  useEffect(() => {
    if (isEditMode) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/recharge/api/community/${id}`);
      const data = res.data;

      setTitle(data.communityTitle);
      setContent(data.communityContent);
      setCommunityTab(data.communityTab);
      
      if (data.communityImagePath) {
        setExistingImagePath(data.communityImagePath);
        setImage(`/recharge${data.communityImagePath}`);
      }
    } catch (err) {
      console.error("게시글 불러오기 실패:", err);
      alert("게시글을 불러올 수 없습니다.");
      navigate("/community");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 이미지 선택
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageFile(file);
      setDeleteImage(false); // 새 이미지 선택 시 삭제 플래그 해제
    }
  };

  // ✅ 이미지 삭제
  const handleImageRemove = () => {
    setImage(null);
    setImageFile(null);
    setExistingImagePath(null);
    setDeleteImage(true); // 이미지 삭제 플래그 설정
  };

  // ✅ 게시글 등록/수정
  const handleSubmit = async () => {
   
    
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요!");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("communityTitle", title);
      formData.append("communityContent", content);
      formData.append("communityTab", communityTab);

      if (isEditMode) {
        // 수정 모드
        formData.append("deleteImage", deleteImage);
        
        // 새 이미지가 있을 때만 추가
        if (imageFile) {
          formData.append("communityImage", imageFile);
        }

        const res = await axios.put(
          `/recharge/api/community/${id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (res.data.success) {
          alert("게시글이 수정되었습니다!");
          navigate(`/community/detail/${id}`);
        } else {
          alert(res.data.message || "게시글 수정에 실패했습니다.");
        }
      } else {
        // 등록 모드
        formData.append("createId", userId);
        if (imageFile) formData.append("communityImage", imageFile);

        const res = await axios.post(
          "/recharge/api/community",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
     
        console.log(res.data); //서버가 실제로 뭘 반환하는지 확인 

        if (res.status === 200) {
          alert("게시글이 등록되었습니다!");
          navigate("/community");
        } else {
          alert(res.data.message || "게시글 등록에 실패했습니다.");
        }
      }
    } catch (err) {
      console.error(`게시글 ${isEditMode ? '수정' : '등록'} 실패:`, err);
      alert(`서버와 통신 중 오류가 발생했습니다: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <div className="community_write-container"><p>로딩 중...</p></div>;
  }

  return (
    <div className="community_write-container">
      <h2>{isEditMode ? "게시글 수정" : "게시글 작성"}</h2>

      {/* ✅ 카테고리 선택 */}
      <div className="community_category-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={communityTab === tab.key ? "active" : ""}
            onClick={() => setCommunityTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ✅ 제목 입력 */}
      <div className="community_write-header">
        <input
          type="text"
          className="community_write-title"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* ✅ 내용 입력 */}
      <div className="community_write-form">
        <textarea
          className="community_write-textarea"
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {/* ✅ 이미지 첨부 */}
      <div className="community_write-imagebox-container">
        <div className="community_write-imagebox">
          <label htmlFor="imageUpload" className="community_image-label">
            {image ? "이미지 변경" : "이미지 첨부"}
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
          {image && (
            <button className="community_image-remove-btn"
              type="button"
              onClick={handleImageRemove}
             
            >
              이미지 삭제
            </button>
          )}
        </div>
        {image && (
          <img
            src={image}
            alt="미리보기"
            className="community_preview-image"
          />
        )}
      </div>

      {/* ✅ 등록/수정 버튼 */}
      <div className="community_submit-container">
        <button 
          className="community_submit-btn" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "처리 중..." : isEditMode ? "수정하기" : "등록하기"}
        </button>
        <button 
          className="community_cancel-btn"
          onClick={() => navigate(-1)}
          
        >
          취소
        </button>
      </div>
    </div>
  );
}

export default CommunityWritePage;