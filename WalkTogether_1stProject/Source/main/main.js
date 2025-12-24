document.addEventListener("DOMContentLoaded", function () {
    const hoverImg = document.querySelector(".main_content img");

    hoverImg.addEventListener("click", function () {
        const isLoggedIn = localStorage.getItem("isLoggedIn");

        if (isLoggedIn === "true") {
            location.href = "../mate/mate_finder.html";
        } else {
            alert("로그인이 필요합니다.");
            location.href = "../login/login_user.html";
        }
    });
});