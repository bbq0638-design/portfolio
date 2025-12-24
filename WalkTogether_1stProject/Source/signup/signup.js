// signup.js
// HTML의 id/class는 수정하지 않습니다. (#login_form, #id_check_button, #id, #pw, #pw_confirm 그대로 사용)

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login_form");
  const idCheckBtn = document.getElementById("id_check_button");
  const idInput = document.getElementById("id");
  const pwInput = document.getElementById("pw");
  const pwConfirmInput = document.getElementById("pw_confirm");

  // 아이디 중복 확인 (목록 읽기 불필요: 해당 키만 검사)
  idCheckBtn?.addEventListener("click", () => {
    const id = (idInput?.value || "").trim();
    if (!id) {
      alert("아이디를 입력해주세요.");
      idInput?.focus();
      return;
    }
    const key = `user:${id}`;
    const exists = localStorage.getItem(key) !== null;
    alert(exists ? "이미 존재하는 아이디입니다." : "사용 가능한 아이디입니다.");
  });

  // 회원가입 제출
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const id = (idInput?.value || "").trim();
    const pw = pwInput?.value || "";
    const pw2 = pwConfirmInput?.value || "";

    // 기본 검증
    if (!id) {
      alert("아이디를 입력해주세요.");
      idInput?.focus();
      return;
    }
    if (pw.length < 4) {
      alert("비밀번호는 4자 이상으로 입력해주세요.");
      pwInput?.focus();
      return;
    }
    if (pw !== pw2) {
      alert("비밀번호가 일치하지 않습니다.");
      pwConfirmInput?.focus();
      return;
    }

    const key = `user:${id}`;
    if (localStorage.getItem(key) !== null) {
      alert("이미 존재하는 아이디입니다.");
      idInput?.focus();
      return;
    }

    // 계정 저장 (아이디별 개별 키 방식)
    localStorage.setItem(
      key,
      JSON.stringify({
        id,
        pw,
        profile: null,          // 프로필은 이후 단계에서 채움
        createdAt: Date.now(),  // 선택
      })
    );

    // 다음 단계로 사용자 컨텍스트 전달 (프로필 작성 페이지에서 사용)
    sessionStorage.setItem("pendingUserId", id);

    alert("회원가입이 완료되었습니다. 프로필 작성 페이지로 이동합니다.");
    // 필요 시 파일명 변경 가능 (예: 'profile.html')
    location.href = "../Profile_Edit/Profile_Edit.html";
  });
});
