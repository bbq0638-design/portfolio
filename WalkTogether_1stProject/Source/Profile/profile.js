const picpeed = document.getElementById('profile_picpeedbox');
const infopeed = document.getElementById('profile_userpeedbox');
const tabpic = document.getElementById('tab_pic');
const tabinfo = document.getElementById('tab_info');

// 탭 전환 이벤트 리스너
tabpic.addEventListener('click', function(){
    infopeed.style.display = 'none';
    picpeed.style.display = 'block';
    tabpic.style.background = '#ffbc4c';
    tabinfo.style.background = 'white';
});

tabinfo.addEventListener('click', function(){
    picpeed.style.display = 'none';
    infopeed.style.display = 'flex'; // 반려동물 캐러셀 래퍼를 포함하므로 flex로 변경
    tabinfo.style.background = '#ffbc4c';
    tabpic.style.background = 'white';
});


document.addEventListener('DOMContentLoaded', function() {
    const piccount = document.getElementsByClassName('profile_picpeedimg');

    for (let i = 0; i < piccount.length; i++) {
        // 각 사진 요소에 클릭 이벤트 리스너를 추가합니다.
        piccount[i].addEventListener('click', function() {
            // 팝업창의 크기를 변수로 지정합니다.
            const popupWidth = 750;
            const popupHeight = 800;

            // 화면 중앙 위치를 계산합니다.
            const left = (screen.width / 2) - (popupWidth / 2);
            const top = (screen.height / 2) - (popupHeight / 2);

            // 템플릿 리터럴을 사용해 URL과 옵션을 동적으로 생성합니다.
            const url = `../popup/profile/profile_picdetail${i}.html`;
            const name = 'picpopup01';
            const option = `width=${popupWidth}, height=${popupHeight}, top=${top}, left=${left}, location=no, toolbar=no`;

            window.open(url, name, option);
        });
    }

    // 로컬스토리지에서 데이터를 읽어와 프로필을 업데이트하는 새로운 코드
    let currentPetIndex = 0; // 현재 표시 중인 반려동물의 인덱스

        function loadProfileData() {
        // 1. 사용자 프로필 데이터 로드
        const userDataString = localStorage.getItem('userProfile');
        const userData = userDataString ? JSON.parse(userDataString) : null;

        // ** display_last_walk_date는 userData와 상관없이 항상 현재 날짜로 설정 **
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        document.getElementById('display_last_walk_date').textContent = `${year}.${month}.${day}`;


        if (userData) {
            // 메인 프로필 섹션 업데이트
            const petDataForProfile = localStorage.getItem('petProfiles');
            const petProfiles = petDataForProfile ? JSON.parse(petDataForProfile) : [];

            document.getElementById('display_user_profile_img').src = 
                (petProfiles.length > 0 && petProfiles[0].imagePath) 
                ? petProfiles[0].imagePath 
                : '../image/noimage.png';
            document.getElementById('display_user_nickname').textContent = userData.nickname || '닉네임';

            // 좋아하는 플레이스 이미지 업데이트 (2개 고정)
            const placeImg1 = document.getElementById('display_place_img_1');
            const placeImg2 = document.getElementById('display_place_img_2');

            if (userData.favoritePlaceImages && userData.favoritePlaceImages.length > 0) {
                placeImg1.src = userData.favoritePlaceImages[0] || '../image/noimage.png';
                if (userData.favoritePlaceImages.length > 1) {
                    placeImg2.src = userData.favoritePlaceImages[1] || '../image/noimage.png';
                } else {
                    placeImg2.src = '../image/noimage.png'; // 두 번째 이미지가 없으면 기본 이미지
                }
            } else {
                placeImg1.src = '../image/noimage.png';
                placeImg2.src = '../image/noimage.png';
            }

            // 집사 정보 탭 업데이트
            document.getElementById('display_user_info_img').src = userData.profileImagePath || '../image/noimage.png';
            document.getElementById('display_user_name').textContent = userData.name || 'N/A';
            document.getElementById('display_user_age').textContent = userData.age ? `${userData.age}세` : 'N/A';
            document.getElementById('display_user_info_nickname').textContent = userData.nickname || 'N/A';

            // 성별과 산책 시간대를 맨 위로 올림
            document.getElementById('display_user_gender').textContent = userData.gender || 'N/A';
            document.getElementById('display_user_walktimes').textContent = userData.walkTimes && userData.walkTimes.length > 0 ? userData.walkTimes.join(', ') : 'N/A';

            document.getElementById('display_user_region').textContent =
                (userData.province && userData.city && userData.province !== '0' && userData.city !== '0')
                ? `${userData.province} ${userData.city} ${userData.detailAddress || ''}`
                : 'N/A';
            document.getElementById('display_user_onetime_walk').textContent = userData.oneCTime || 'N/A';
            document.getElementById('display_user_walkstyle').textContent = userData.walkStyles && userData.walkStyles.length > 0 ? userData.walkStyles.join(', ') : 'N/A';
            document.getElementById('display_user_mbti').textContent = userData.mbti || 'N/A';
            document.getElementById('display_user_introduction').textContent = userData.introduction || 'N/A';

            // 작은 정보 박스 (평균 산책 시간, 총 메이트 횟수, 매너 점수)
            // `display_last_walk_date`는 위에서 이미 설정했음
            document.getElementById('display_avg_walk_time').textContent = userData.oneCTime || 'N/A'; // userData가 있을 때 설정
            document.getElementById('display_total_mates').textContent = '20'; // 예시값
            document.getElementById('display_manner_score').textContent = '65점'; // 예시값
            document.getElementById('display_manner_progress').value = 65; // 예시값


        } else {
            console.log('로컬 스토리지에 사용자 프로필 데이터가 없습니다.');
            document.getElementById('display_user_profile_img').src = '../image/noimage.png';
            document.getElementById('display_user_nickname').textContent = '닉네임 (미입력)';
            document.getElementById('display_place_img_1').src = '../image/noimage.png';
            document.getElementById('display_place_img_2').src = '../image/noimage.png';

            // userData가 없을 때 N/A로 설정할 필드들
            document.getElementById('display_user_name').textContent = 'N/A';
            document.getElementById('display_user_age').textContent = 'N/A';
            document.getElementById('display_user_info_nickname').textContent = 'N/A';
            document.getElementById('display_user_gender').textContent = 'N/A';
            document.getElementById('display_user_walktimes').textContent = 'N/A';
            document.getElementById('display_user_region').textContent = 'N/A';
            document.getElementById('display_user_onetime_walk').textContent = 'N/A';
            document.getElementById('display_user_walkstyle').textContent = 'N/A';
            document.getElementById('display_user_mbti').textContent = 'N/A';
            document.getElementById('display_user_introduction').textContent = 'N/A';

            // 작은 정보 박스 관련
            document.getElementById('display_avg_walk_time').textContent = 'N/A'; // userData가 없을 때 N/A
            document.getElementById('display_total_mates').textContent = 'N/A'; // 예시값, userData 없으면 N/A
            document.getElementById('display_manner_score').textContent = '0점'; // 예시값, userData 없으면 0점
            document.getElementById('display_manner_progress').value = 0; // 예시값, userData 없으면 0
        }

        // 2. 반려동물 프로필 데이터 로드 및 캐러셀 처리 (이 부분은 변경 없음)
        const petDataString = localStorage.getItem('petProfiles');
        const petProfiles = petDataString ? JSON.parse(petDataString) : [];
        const petProfilesContainer = document.getElementById('pet_profiles_container');
        petProfilesContainer.innerHTML = ''; // 기존 반려동물 정보 제거

        const nextPetBtn = document.getElementById('next_pet_btn');

        if (petProfiles.length > 0) {
            petProfiles.forEach((pet, index) => {
                const petInfoBox = document.createElement('div');
                petInfoBox.className = 'profile_petinfobox';
                petInfoBox.style.width = '100%'; // 캐러셀 컨테이너의 100%를 차지
                petInfoBox.innerHTML = `
                    <div class="profile_title_box">
                        <span class="profile_petinfo_title_text">반려동물 ${index + 1}</span>
                    </div>
                    <div class="profile_detail_container">
                        <img class="profile_info_img" src="${pet.imagePath || '../image/noimage.png'}">
                        <div class="profile_info_detail01">
                            <div class="profile_info_5001">
                                <span class="profile_info_title">이름</span>
                                <span class="profile_info_detail_text">${pet.name || 'N/A'}</span>
                            </div>
                            <div class="profile_info_5001">
                                <span class="profile_info_title">성격</span>
                                <span class="profile_info_detail_text">${pet.personality && pet.personality.length > 0 ? pet.personality.join(', ') : 'N/A'}</span>
                            </div>
                            <div class="profile_info_5001">
                                <span class="profile_info_title">나이</span>
                                <span class="profile_info_detail_text">${pet.ageYear !== '0' && pet.ageMonth !== '0' ? `${pet.ageYear}살 ${pet.ageMonth}개월` : (pet.ageYear !== '0' ? `${pet.ageYear}살` : (pet.ageMonth !== '0' ? `${pet.ageMonth}개월` : 'N/A'))}</span>
                            </div>
                        </div>
                    </div>
                    <div class="profile_detail_container02">
                        <div class="profile_info_5002">
                            <span class="profile_info_title">성별</span>
                            <span class="profile_info_detail_text">${pet.gender || 'N/A'}</span>
                        </div>
                        <div class="profile_info_5002">
                            <span class="profile_info_title">중성화 여부</span>
                            <span class="profile_info_detail_text">${pet.neutering || 'N/A'}</span>
                        </div>
                        <div class="profile_info_5002">
                            <span class="profile_info_title">견종</span>
                            <span class="profile_info_detail_text">${pet.type || 'N/A'}</span>
                        </div>
                        <div class="profile_info_5002">
                            <span class="profile_info_title">몸무게</span>
                            <span class="profile_info_detail_text">${pet.weight || 'N/A'}</span>
                        </div>
                        <div class="profile_info_5002">
                            <span class="profile_info_title">산책 스타일</span>
                            <span class="profile_info_detail_text">${pet.walkStyle && pet.walkStyle.length > 0 ? pet.walkStyle.join(', ') : 'N/A'}</span>
                        </div>
                        <div class="profile_info_5002">
                            <span class="profile_info_title">동물등록여부</span>
                            <span class="profile_info_detail_text">${pet.registered || 'N/A'}</span>
                        </div>
                        <div class="profile_info_5002">
                            <span class="profile_info_title">동물등록번호</span>
                            <span class="profile_info_detail_text">${pet.registered === '예' ? (pet.registrationNumber || 'N/A') : '등록 안됨'}</span>
                        </div>
                        <div class="profile_info_5002" style="width: 100%;">
                            <span class="profile_info_title">자유로운 소개</span>
                            <span class="profile_info_detail_text">${pet.introduction || 'N/A'}</span>
                        </div>
                    </div>
                `;
                petProfilesContainer.appendChild(petInfoBox);
            });

            // 반려동물이 1마리 초과일 때만 "더보기" 버튼 표시
            if (petProfiles.length > 1) {
                nextPetBtn.style.display = 'block';
                nextPetBtn.addEventListener('click', function() {
                    currentPetIndex = (currentPetIndex + 1) % petProfiles.length;
                    updatePetCarousel();
                });
            } else {
                nextPetBtn.style.display = 'none';
            }

            updatePetCarousel(); // 초기 캐러셀 상태 설정

        } else {
            const noPetMessage = document.createElement('div');
            noPetMessage.className = 'profile_petinfobox';
            noPetMessage.style.textAlign = 'center';
            noPetMessage.style.marginTop = '20px';
            noPetMessage.innerHTML = '<span class="profile_petinfo_title_text">등록된 반려동물 프로필이 없습니다.</span>';
            petProfilesContainer.appendChild(noPetMessage);
            nextPetBtn.style.display = 'none';
        }
    }

    // 반려동물 캐러셀 업데이트 함수
    function updatePetCarousel() {
        const petProfilesContainer = document.getElementById('pet_profiles_container');
        const petInfoBoxes = petProfilesContainer.querySelectorAll('.profile_petinfobox');
        if (petInfoBoxes.length > 0) {
            const offset = -currentPetIndex * 100; // 왼쪽으로 100%씩 이동
            petProfilesContainer.style.transform = `translateX(${offset}%)`;
        }
    }

    // 페이지 로드 시 프로필 데이터 로드
    loadProfileData();
});


const materequest = document.getElementById('mate_request_id');

materequest.addEventListener('click', function(){
    alert("상대방에게 메이트 신청을 보냈습니다!");
});

// 팝업 함수
function popup_message() {
    window.open('../popup/message/message.html', '메세지채팅창', 'width=480px, height=700px, location=no');
}

function popup_notice() {
    window.open('../popup/notification/notification.html', '알림창', 'width=480px, height=700px, location=no');
}

// 로그인 상태 확인 함수
function loginCheck() {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";

    const loginStatus = document.querySelector(".login_status");
    const logoutStatus = document.querySelector(".logout_status");

    if(loginStatus && logoutStatus) {
        loginStatus.style.display = loggedIn ? "flex" : "none";
        logoutStatus.style.display = loggedIn ? "none" : "flex";
    }
}


const reportbtn = document.getElementById('report_btn_id');
const editbtn = document.getElementById('edit_profile_btn_id');

// 마이페이지 여부 확인 함수
function mypageCheck(){
    // 이 부분은 현재 보고 있는 프로필이 로그인한 사용자의 프로필인지 아닌지를 구분하는 로직이 필요합니다.
    // 임시로 'false'로 설정하여 항상 신고 버튼이 보이고 수정 버튼이 숨겨지도록 했습니다.
    // 실제 구현 시에는 적절한 사용자 ID 비교 로직을 추가해야 합니다.
    localStorage.setItem('ismypageIn', 'false');

    const mypageIn = localStorage.getItem("ismypageIn") === "true";

    reportbtn.style.display = mypageIn ? 'none' : "flex"; // 내 페이지면 신고 버튼 숨김
    editbtn.style.display = mypageIn ? 'flex' : 'none';   // 내 페이지면 수정 버튼 보임
}

// DOMContentLoaded 이벤트 발생 시 함수들 실행
document.addEventListener("DOMContentLoaded", loginCheck);
document.addEventListener("DOMContentLoaded", mypageCheck); // 기존 mypageCheck 호출 유지

// 신고 버튼 이벤트 리스너
reportbtn.addEventListener('click', function(){
            const popupWidth = 480;
            const popupHeight = 700;

            // 화면 중앙 위치를 계산합니다.
            const left = (screen.width / 2) - (popupWidth / 2);
            const top = (screen.height / 2) - (popupHeight / 2);

            // 템플릿 리터럴을 사용해 URL과 옵션을 동적으로 생성합니다.
            const url = '../popup/report/report.html';
            const name = 'picpopup01';
            const option = `width=${popupWidth}, height=${popupHeight}, top=${top}, left=${left}, location=no, toolbar=no`;

            window.open(url, name, option);
});