// 페이지 로드 시 실행되는 함수
document.addEventListener('DOMContentLoaded', () => {
    renderPost();
    loginCheck();
});

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

function renderPost() {
    // 1. URL에서 게시글 ID 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        alert('게시글 ID가 없습니다.');
        return;
    }

    // 2. 로컬 스토리지에서 게시글 목록 가져오기 (최신순으로 정렬)
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const sortedPosts = posts.slice().sort((a, b) => b.id - a.id);
    
    // 3. URL의 ID와 일치하는 게시글 찾기
    const postIndex = sortedPosts.findIndex(p => p.id === parseInt(postId));

    if (postIndex !== -1) {
        const post = sortedPosts[postIndex];
        
        // 4. 게시글 데이터로 페이지 채우기
        document.getElementById('postTitle').textContent = post.placeName;
        document.getElementById('postDate').textContent = new Date(post.id).toLocaleDateString(); 
        document.getElementById('placeAddress').textContent = post.placeAddress;
        document.getElementById('placeCategory').textContent = post.placeCategory;
        document.getElementById('oneLineReview').textContent = post.oneLineReview;
        document.getElementById('Review').textContent = post.review;
        
        // 이미지 표시
        const postImage = document.getElementById('postImage');
        if (post.imageData) {
            postImage.src = post.imageData;
        } else {
            postImage.src = '../image/noimage.png';
        }

        // 별점 표시
        const starRatingDiv = document.getElementById('starRating');
        starRatingDiv.innerHTML = ''; // 기존 별점 초기화
        for (let i = 1; i <= 5; i++) {
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'star_score_view';
            input.className = 'star';
            input.value = i;
            input.disabled = true;
            if (i == post.starRating) {
                input.checked = true;
            }
            starRatingDiv.appendChild(input);
        }

        // 5. 이전/다음 게시글 로직
        const prevPostElement = document.getElementById('prevPost');
        const nextPostElement = document.getElementById('nextPost');
        
        // 이전 게시글 (배열 상 다음 인덱스)
        if (postIndex < sortedPosts.length - 1) {
            const prevPost = sortedPosts[postIndex + 1];
            prevPostElement.style.display = 'block';
            prevPostElement.querySelector('a').textContent = prevPost.placeName;
            prevPostElement.querySelector('a').href = `./Place_Detail.html?id=${prevPost.id}`;
        } else {
            prevPostElement.style.display = 'none'; // 이전 게시글이 없으면 숨김
        }

        // 다음 게시글 (배열 상 이전 인덱스)
        if (postIndex > 0) {
            const nextPost = sortedPosts[postIndex - 1];
            nextPostElement.style.display = 'block';
            nextPostElement.querySelector('a').textContent = nextPost.placeName;
            nextPostElement.querySelector('a').href = `./Place_Detail.html?id=${nextPost.id}`;
        } else {
            nextPostElement.style.display = 'none'; // 다음 게시글이 없으면 숨김
        }

    } else {
        alert('게시글을 찾을 수 없습니다.');
    }
}