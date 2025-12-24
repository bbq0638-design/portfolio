
import React, { useState } from "react";
import "../../css/modal/Modal.css";

function ReportModal({ isOpen, onClose, onSubmit, targetType }) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  return (
    <div className="report-modal-overlay">
      <div className="report-modal">
        <h3>{targetType === "comment" ? "댓글 신고하기" : "게시글 신고하기"}</h3>

        <div className="report-options">
          <label>
            <input
              type="radio"
              name="reason"
              value="부적절한 게시글"
              onChange={(e) => setReason(e.target.value)}
            />
            부적절한 게시글
          </label>

          <label>
            <input
              type="radio"
              name="reason"
              value="광고글"
              onChange={(e) => setReason(e.target.value)}
            />
            광고글
          </label>
        </div>

        <div className="report-modal-buttons">
          <button className="community_report-btn"
            onClick={() => {
              if (!reason) {
                alert("신고 사유를 선택해주세요.");
                return;
              }
              onSubmit(reason);
            }}
          >
            신고
          </button>
          <button className="community_report-btn" onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
}

export default ReportModal;
