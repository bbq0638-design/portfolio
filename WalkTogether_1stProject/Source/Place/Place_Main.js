const ads = [
    {
        placeName: '스폰서 애견카페',
        placeCategory: '카페',
        placeAddress: '서울시',
        imageData: 'https://placehold.co/600x400/FF0000/FFFFFF?text=Ad+1',
        starRating: 5,
        oneLineReview: '최고의 시설을 경험하세요!',
        isAd: true,
        adLink: 'https://www.google.com'
    },
    {
        placeName: '프리미엄 펫샵',
        placeCategory: '펫샵',
        placeAddress: '경기도',
        imageData: 'https://placehold.co/600x400/0000FF/FFFFFF?text=Ad+2',
        starRating: 4,
        oneLineReview: '다양한 용품과 건강한 간식!',
        isAd: true,
        adLink: 'https://www.naver.com'
    },
    {
        placeName: '전문 훈련소',
        placeCategory: '훈련소',
        placeAddress: '인천시',
        imageData: 'https://placehold.co/600x400/00FF00/FFFFFF?text=Ad+3',
        starRating: 5,
        oneLineReview: '믿음직한 훈련사가 있는 곳!',
        isAd: true,
        adLink: 'https://www.daum.net'
    }
];

// 페이지당 게시글 수
const POSTS_PER_PAGE = 10;
let currentPage = 1;

// 게시글 카드를 생성하는 함수
function createPostCard(post) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'place_cardbox';

    // 광고인 경우, 링크 이동 이벤트 추가
    if (post.isAd) {
        cardDiv.className += ' ad-card';
        cardDiv.onclick = () => window.location.href = post.adLink;
    }

    // 별점 HTML 생성
    let starHtml = '';
    for (let i = 1; i <= 5; i++) {
        starHtml += `<input type="radio" name="star_score_${post.id}" class="star" value="${i}" disabled ${i <= post.starRating ? 'checked' : ''}>`;
    }
    
    // `place_info_container`의 커서 스타일을 조건부로 적용
    const containerStyle = post.isAd ? 'cursor: pointer;' : '';

    cardDiv.innerHTML = `
        <img class="place_img" src="${post.imageData}">
        <div class="place_info_container" style="${containerStyle}">
            <div class="place_infobox01">
                <span class="place_info01">${post.placeName}</span>
                <span class="place_info01">${post.placeCategory}</span>
                <span class="place_info01">${post.placeAddress}</span>
                <div class="star_rating">
                    <span class="place_info11">후기별점</span>
                    ${starHtml}
                </div>
                ${post.isAd ? '<div class="place_admarkbox"><span>🔥광고</span></div>' : ''}
            </div>
            <div class="${post.isAd ? 'place_adinfobox02' : 'place_infobox02'}">
                ${!post.isAd ? '<span class="place_info01">홍길동</span>' : ''}
                <div class="${post.isAd ? 'place_adinfo02_reviewbox' : 'place_info02_reviewbox'}">
                    <span class="${post.isAd ? 'place_adinfo02_review' : 'place_info02_review'}">${post.oneLineReview}</span>
                </div>
                ${!post.isAd ? `<button class="button1" onclick="location.href='./Place_Detail.html?id=${post.id}'">보러가기</button>` : ''}
            </div>
        </div>
    `;
    return cardDiv;
}

// 게시글 및 광고 렌더링 함수
function renderPosts(page) {
    const postListContainer = document.getElementById('postListContainer');
    // 하단 메뉴는 제외하고 모든 게시글 카드 제거
    const existingCards = postListContainer.querySelectorAll('.place_cardbox');
    existingCards.forEach(card => card.remove());

    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const sortedPosts = posts.slice().sort((a, b) => b.id - a.id);
    
    // 현재 페이지에 해당하는 게시글만 가져오기
    const start = (page - 1) * POSTS_PER_PAGE;
    const end = start + POSTS_PER_PAGE;
    const paginatedPosts = sortedPosts.slice(start, end);

    // 게시글과 광고를 함께 렌더링하기 위한 배열
    const renderQueue = [];
    let adCounter = 0;

    for (let i = 0; i < paginatedPosts.length; i++) {
        // 게시글 3개마다 광고 삽입
        if (i % 2 === 0 && i !== 0 && adCounter < ads.length) {
            renderQueue.push(ads[adCounter]);
            adCounter++;
        }
        renderQueue.push(paginatedPosts[i]);
    }

    // renderQueue의 모든 요소를 DOM에 추가
    renderQueue.forEach(post => {
        const postCard = createPostCard(post);
        postListContainer.insertBefore(postCard, postListContainer.querySelector('.place_bottom_box'));
    });
}

// 페이지네이션 렌더링 함수
function renderPagination() {
    const paginationContainer = document.getElementById('pagination');
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

    paginationContainer.innerHTML = '';
    
    // '<' 버튼
    const prevButton = document.createElement('a');
    prevButton.href = '#';
    prevButton.innerHTML = '&laquo;';
    prevButton.onclick = (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            renderPosts(currentPage);
            renderPagination();
        }
    };
    paginationContainer.appendChild(prevButton);

    // 페이지 번호 생성
    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('a');
        pageLink.href = '#';
        pageLink.textContent = i;
        if (i === currentPage) {
            pageLink.classList.add('active'); // 현재 페이지에 'active' 클래스 추가
        }
        pageLink.onclick = (e) => {
            e.preventDefault();
            currentPage = i;
            renderPosts(currentPage);
            renderPagination();
        };
        paginationContainer.appendChild(pageLink);
    }

    // '>' 버튼
    const nextButton = document.createElement('a');
    nextButton.href = '#';
    nextButton.innerHTML = '&raquo;';
    nextButton.onclick = (e) => {
        e.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            renderPosts(currentPage);
            renderPagination();
        }
    };
    paginationContainer.appendChild(nextButton);
}

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

// 페이지 로드 시 초기 렌더링
document.addEventListener('DOMContentLoaded', () => {
    renderPosts(currentPage);
    renderPagination();
    loginCheck();
});