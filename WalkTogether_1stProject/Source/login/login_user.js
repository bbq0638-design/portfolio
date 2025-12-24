document.getElementById("login_form").addEventListener("submit", function(login_success) {
    login_success.preventDefault();
    localStorage.setItem("isLoggedIn", "true");
    alert("로그인 성공!");
    location.href = "../main/main_page.html";
});