
// HTML 요소들 선택
const form = document.querySelector('form');
const submitBtn = document.getElementById('submit_btn'); // 버튼 요소 추가
const placeWhereInput = document.getElementById('place_where');
const placeCategoryInput = document.getElementById('place_category');
const placeAddressInput = document.getElementById('place_address');
const oneLineReviewInput = document.getElementById('one_line_review');
const reviewTextarea = document.getElementById('review');
const imageInput = document.getElementById('user_place_upload01');
const starInputs = document.querySelectorAll('input[name="star_score"]');

// 폼 대신 버튼에 클릭 이벤트 리스너 추가
submitBtn.addEventListener('click', function(event) {
    event.preventDefault();
    // 이제 event.preventDefault()가 필요 없습니다.
    
    // 1. 입력값 가져오기
    const placeName = placeWhereInput.value;
    const placeCategory = placeCategoryInput.value;
    const placeAddress = placeAddressInput.value;
    const oneLineReview = oneLineReviewInput.value;
    const review = reviewTextarea.value;
    const imageFile = imageInput.files[0];
    let starRating = 3; 
    
    // 선택된 별점 값 찾기
    for (const star of starInputs) {
        if (star.checked) {
            starRating = star.value;
            break;
        }
    }
    
    // 2. 필수 입력값 검사
    if (!placeName) {
        alert('업체명(장소명)은 필수 입력 항목입니다.');
        return;
    }
    if (!placeCategory) {
        alert('장소 카테고리는 필수 입력 항목입니다.');
        return;
    }
    if (!placeAddress) {
        alert('주소는 필수 입력 항목입니다.');
        return;
    }
    if (!oneLineReview) {
        alert('한줄평은 필수 입력 항목입니다.');
        return;
    }
    if(!imageFile){
        alert('사진은 필수 첨부 항목입니다.');
        return;
    }

    // 3. 이미지 처리
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = e.target.result;
            savePost(placeName, placeCategory, placeAddress, oneLineReview, review, imageData, starRating);
        };
        reader.readAsDataURL(imageFile);
    } else {
        savePost(placeName, placeCategory, placeAddress, oneLineReview, review, null, starRating);
    }
});

function savePost(placeName, placeCategory, placeAddress, oneLineReview, review, imageData, starRating) {
    const newPost = {
        id: Date.now(),
        placeName,
        placeCategory,
        placeAddress,
        oneLineReview,
        review,
        imageData,
        starRating
    };

    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.push(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));

    alert('게시글이 성공적으로 저장되었습니다!');
    form.reset();
    window.location.href = `./Place_Detail.html?id=${newPost.id}`;
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

document.addEventListener("DOMContentLoaded", loginCheck);

document.addEventListener('DOMContentLoaded', function() {
        // 모든 요소를 ID로 직접 가져옵니다.
        const input01 = document.getElementById('user_place_upload01');
        const noImage01 = document.getElementById('noImage01');
        const deleteButton01 = document.getElementById('deleteButton01');
        const label01 = document.getElementById('label01');
        
        input01.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            let previewImg = document.getElementById('previewImg01');
            if (!previewImg) {
                previewImg = document.createElement('img');
                previewImg.id = 'previewImg01';
                previewImg.className = 'preview-img';
                label01.appendChild(previewImg);
            }
            previewImg.src = e.target.result;
            
            noImage01.style.display = 'none';
            deleteButton01.style.display = 'flex';
        };
        reader.readAsDataURL(file);
    });

    deleteButton01.addEventListener('click', function(event) {
        event.preventDefault(); 
        event.stopPropagation(); 
        const previewImg = document.getElementById('previewImg01');
        if (previewImg) {
            previewImg.remove();
        }
        input01.value = '';
        noImage01.style.display = 'block';
        deleteButton01.style.display = 'none';
    });
});