function popup_message() {
    window.open('../popup/message/message.html', '메세지채팅창', 'width=480px, height=700px, location=no');
    }

function popup_notice() {
    window.open('../popup/notification/notification.html', '알림창', 'width=480px, height=700px, location=no');
    }

function loginCheck() {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";

    const loginStatus = document.querySelector(".login_status");
    const logoutStatus = document.querySelector(".logout_status");

    if(loginStatus && logoutStatus) {
        loginStatus.style.display = loggedIn ? "flex" : "none";
        logoutStatus.style.display = loggedIn ? "none" : "flex";
    }
}

document.addEventListener("DOMContentLoaded", loginCheck);