// Function to handle showing messages and notifications popups
function popup_message() {
    window.open('../popup/message/message.html', '메세지채팅창', 'width=480px, height=700px, location=no');
}

function popup_notice() {
    window.open('../popup/notification/notification.html', '알림창', 'width=480px, height=700px, location=no');
}

// Function to check login status and display appropriate header links
function loginCheck() {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";

    const loginStatus = document.querySelector(".login_status");
    const logoutStatus = document.querySelector(".logout_status");

    if (loginStatus && logoutStatus) {
        loginStatus.style.display = loggedIn ? "flex" : "none";
        logoutStatus.style.display = loggedIn ? "none" : "flex";
    }
}

// Global counter for dynamic pet forms
let petFormCounter = 1; // Start from 1, as there's one pet form initially

// Mapping for regions (province to city/district)  //regions 라는 변수에 키와 배열을 넣겠다.
const regions = {
    '서울시': ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'],
    '제주도': ['서귀포시', '제주시'],
    '경기도': ['고양시', '과천시', '광명시', '광주시', '구리시', '군포시', '김포시', '남양주시', '동두천시', '부천시', '성남시', '수원시', '시흥시', '안산시', '안성시', '안양시', '양주시', '오산시', '용인시', '의왕시', '의정부시', '이천시', '파주시', '평택시', '포천시', '하남시', '화성시'],
    '경상남도': ['거제시', '김해시', '밀양시', '사천시', '양산시', '진주시', '창원시', '통영시'],
    '경상북도': ['경산시', '경주시', '구미시', '김천시', '문경시', '상주시', '안동시', '영주시', '영천시', '포항시'],
    '강원도': ['강릉시', '동해시', '삼척시', '속초시', '원주시', '춘천시', '태백시'],
    '전라남도': ['광양시', '나주시', '목포시', '순천시', '여수시'],
    '충청남도': ['계룡시', '공주시', '논산시', '당진시', '보령시', '서산시', '아산시', '천안시'],
    '충청북도': ['제천시', '청주시', '충주시']
};

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements for user form and pet form tabs
    const userform = document.getElementById('userform_id');
    const petform = document.getElementById('petform_id');
    const usertab = document.getElementById('user_profile');
    const pettab = document.getElementById('pet_profile');

    // Initial state: User profile tab is active
    usertab.style.background = '#ffbc4c';
    petform.style.display = 'none';

    // Tab switching logic
    pettab.addEventListener('click', function() {
        userform.style.display = 'none';
        petform.style.display = 'block';
        usertab.style.background = 'white';
        pettab.style.background = '#ffbc4c';
    });
    usertab.addEventListener('click', function() {
        petform.style.display = 'none';
        userform.style.display = 'block';
        usertab.style.background = '#ffbc4c';
        pettab.style.background = 'white';
    });

    loadExistingProfileData();

    function loadExistingProfileData() {
    loadUserProfileData();
    loadPetProfilesData();
    }

    function loadUserProfileData() {
        const userDataString = localStorage.getItem('userProfile');
        if (!userDataString) return; // 기존 데이터가 없으면 종료
        
        const userData = JSON.parse(userDataString);
        
        // 사용자 기본 정보
        const userName = document.querySelector('.userform_box .userdetail01_box:nth-of-type(1) .userdetail01_textbox');
        if (userName) userName.value = userData.name || '';
        
        const userAge = document.querySelector('.userform_box .userdetail01_box:nth-of-type(2) .userdetail01_textbox');
        if (userAge) userAge.value = userData.age || '';
        
        const userNickname = document.querySelector('.userform_box .userdetail01_box02 .userdetail01_textbox');
        if (userNickname) userNickname.value = userData.nickname || '';
        
        // 지역 정보
        const provinceSelect = document.getElementById('do');
        if (provinceSelect && userData.province) {
            console.log(`설정할 도/시: ${userData.province}`);
            provinceSelect.value = userData.province;
            
            // 직접 구/시 옵션 생성
            const citySelect = document.getElementById('city');
            citySelect.innerHTML = '<option value="0" selected>구/시를 선택해주세요.</option>';
            
            const cities = regions[userData.province];
            console.log(`${userData.province}의 구/시 목록:`, cities);
            
            if (cities && Array.isArray(cities)) {
                cities.forEach(city => {
                    const option = document.createElement('option');
                    option.value = city;
                    option.textContent = city;
                    citySelect.appendChild(option);
                });
                
                console.log(`구/시 옵션 생성 완료: ${cities.length}개`);
                
                // 저장된 구/시 값 설정
                if (userData.city) {
                    setTimeout(() => {
                        citySelect.value = userData.city;
                        console.log(`구/시 설정 시도: ${userData.city}`);
                        console.log(`실제 설정된 값: ${citySelect.value}`);
                    }, 100);
                }
            } else {
                console.error(`${userData.province}에 해당하는 구/시 데이터가 없습니다.`);
            }
        }
        
        // 성별
        if (userData.gender) {
            const genderRadio = document.querySelector(`input[name="gender"][value="${userData.gender}"]`);
            if (genderRadio) genderRadio.checked = true;
        }
        
        // 전화번호
        const phoneNumber = document.querySelector('.userdetail03_textbox');
        if (phoneNumber) phoneNumber.value = userData.phoneNumber || '';
        
        // 한 번쯤 만나고 싶어요
        if (userData.oneCTime) {
            const oneCTimeRadio = document.querySelector(`input[name="oncetime"][value="${userData.oneCTime}"]`);
            if (oneCTimeRadio) oneCTimeRadio.checked = true;
        }
        
        // MBTI
        if (userData.mbti) {
            const mbtiRadio = document.querySelector(`input[name="mbti"][value="${userData.mbti}"]`);
            if (mbtiRadio) mbtiRadio.checked = true;
        }
        
        // 산책 스타일 (다중 선택)
        if (userData.walkStyles && Array.isArray(userData.walkStyles)) {
            userData.walkStyles.forEach(style => {
                const walkStyleCheckbox = document.querySelector(`input[name="walkstyle"][value="${style}"]`);
                if (walkStyleCheckbox) walkStyleCheckbox.checked = true;
            });
        }
        
        // 산책 시간 (다중 선택)
        if (userData.walkTimes && Array.isArray(userData.walkTimes)) {
            userData.walkTimes.forEach(time => {
                const walkTimeCheckbox = document.querySelector(`input[name="walktime"][value="${time}"]`);
                if (walkTimeCheckbox) walkTimeCheckbox.checked = true;
            });
        }
        
        // 자기소개
        const introduction = document.querySelector('.userdetail11_textarea');
        if (introduction) introduction.value = userData.introduction || '';
        
        // 프로필 이미지
        if (userData.profileImagePath && !userData.profileImagePath.includes('noimage.png')) {
            loadUserProfileImage(userData.profileImagePath);
        }
        
        // 선호 장소 이미지들
        if (userData.favoritePlaceImages && Array.isArray(userData.favoritePlaceImages)) {
            userData.favoritePlaceImages.forEach((imagePath, index) => {
                if (index === 0) loadFavoritePlaceImage(imagePath, 'previewImg01', 'noImage01', 'deleteButton01');
                if (index === 1) loadFavoritePlaceImage(imagePath, 'previewImg02', 'noImage02', 'deleteButton02');
            });
        }
    }

    function loadUserProfileImage(imagePath) {
        const userImgElement = document.getElementById('userimg_id');
        const deleteButton = document.getElementById('userpic_dbtn_id');
        const previewImg = document.getElementById('previewImg_user_profile');
        
        if (!previewImg) {
            // 미리보기 이미지가 없으면 생성
            const newPreviewImg = document.createElement('img');
            newPreviewImg.id = 'previewImg_user_profile';
            newPreviewImg.className = 'preview-img';
            const label = document.getElementById('userpic_label_id');
            if (label) label.appendChild(newPreviewImg);
        }
        
        const finalPreviewImg = document.getElementById('previewImg_user_profile');
        if (finalPreviewImg) {
            finalPreviewImg.src = imagePath;
            finalPreviewImg.style.display = 'block';
        }
        
        if (userImgElement) userImgElement.style.display = 'none';
        if (deleteButton) deleteButton.style.display = 'flex';
    }

    function loadFavoritePlaceImage(imagePath, previewId, noImageId, deleteButtonId) {
        const noImageElement = document.getElementById(noImageId);
        const deleteButton = document.getElementById(deleteButtonId);
        let previewImg = document.getElementById(previewId);
        
        if (!previewImg) {
            previewImg = document.createElement('img');
            previewImg.id = previewId;
            previewImg.className = 'preview-img';
            // label ID 수정 필요
            const labelId = previewId.replace('previewImg', 'label');
            const label = document.getElementById(labelId);
            if (label) label.appendChild(previewImg);
        }
        
        if (previewImg) {
            previewImg.src = imagePath;
            previewImg.style.display = 'block';
        }
        
        if (noImageElement) noImageElement.style.display = 'none';
        if (deleteButton) deleteButton.style.display = 'flex';
    }

    function loadPetProfilesData() {
        const petDataString = localStorage.getItem('petProfiles');
        if (!petDataString) return;
        
        const petProfiles = JSON.parse(petDataString);
        if (!Array.isArray(petProfiles) || petProfiles.length === 0) return;
        
        // 첫 번째 반려동물은 기본 폼에 로드
        if (petProfiles[0]) {
            loadSinglePetData(document.querySelector('.petform_box'), petProfiles[0], 1);
        }
        
        // 두 번째부터는 새 폼 생성 후 로드
        for (let i = 1; i < petProfiles.length; i++) {
            petFormCounter++;
            createNewPetForm();
            const newPetForm = document.getElementById(`petform_box_${petFormCounter}`);
            if (newPetForm) {
                loadSinglePetData(newPetForm, petProfiles[i], petFormCounter);
            }
        }
    }

    function loadSinglePetData(petFormBox, petData, index) {
        // 이름
        const petName = petFormBox.querySelector(`#petname_${index}`);
        if (petName) petName.value = petData.name || '';
        
        // 종류
        const petType = petFormBox.querySelector(`#pettype_${index}`);
        if (petType) petType.value = petData.type || '';
        
        // 성별
        if (petData.gender) {
            const genderRadio = petFormBox.querySelector(`input[name="petgender_${index}"][value="${petData.gender}"]`);
            if (genderRadio) genderRadio.checked = true;
        }
        
        // 나이
        const petYear = petFormBox.querySelector(`#petyear_${index}`);
        if (petYear) petYear.value = petData.ageYear || '0';
        
        const petMonth = petFormBox.querySelector(`#petmonth_${index}`);
        if (petMonth) petMonth.value = petData.ageMonth || '0';
        
        // 중성화
        if (petData.neutering) {
            console.log(`중성화 데이터 로드: ${petData.neutering} (인덱스: ${index})`);
            
            const neuteringRadio = petFormBox.querySelector(`input[name="neutering_${index}"][value="${petData.neutering}"]`);
            
            if (neuteringRadio) {
                neuteringRadio.checked = true;
                console.log(`중성화 설정 완료: ${petData.neutering}`);
            } else {
                console.error(`중성화 라디오 찾을 수 없음. name="neutering_${index}", value="${petData.neutering}"`);
                // HTML의 실제 구조 확인
                console.log('사용 가능한 중성화 라디오들:', petFormBox.querySelectorAll(`input[name*="neutering"]`));
            }
        }
        
        // 등록 여부
        if (petData.registered) {
            const registeredRadio = petFormBox.querySelector(`input[name="petregister_${index}"][value="${petData.registered}"]`);
            if (registeredRadio) {
                registeredRadio.checked = true;
                // 등록번호 입력창 활성화/비활성화
                const registNumInput = petFormBox.querySelector(`#petnumber${index}`);
                if (registNumInput) {
                    if (petData.registered === '예') {
                        registNumInput.disabled = false;
                        registNumInput.value = petData.registrationNumber || '';
                    } else {
                        registNumInput.disabled = true;
                        registNumInput.value = '';
                    }
                }
            }
        }
        
        // 몸무게
        if (petData.weight) {
            const weightRadio = petFormBox.querySelector(`input[name="petweight_${index}"][value="${petData.weight}"]`);
            if (weightRadio) weightRadio.checked = true;
        }
        
        // 성격 (다중 선택)
        if (petData.personality && Array.isArray(petData.personality)) {
            petData.personality.forEach(trait => {
                const personalityCheckbox = petFormBox.querySelector(`input[name="petpersonal_${index}"][value="${trait}"]`);
                if (personalityCheckbox) personalityCheckbox.checked = true;
            });
        }
        
        // 산책 스타일 (다중 선택)
        if (petData.walkStyle && Array.isArray(petData.walkStyle)) {
            petData.walkStyle.forEach(style => {
                const walkStyleCheckbox = petFormBox.querySelector(`input[name="petwalkstyle_${index}"][value="${style}"]`);
                if (walkStyleCheckbox) walkStyleCheckbox.checked = true;
            });
        }
        
        // 자기소개
        const petIntroduction = petFormBox.querySelector(`#petintroduction_${index}`);
        if (petIntroduction) petIntroduction.value = petData.introduction || '';
        
        // 프로필 이미지
        if (petData.imagePath && !petData.imagePath.includes('noimage.png')) {
            loadPetProfileImage(petFormBox, petData.imagePath, index);
        }
    }

    function loadPetProfileImage(petFormBox, imagePath, index) {
        const noImageElement = petFormBox.querySelector('.petimg');
        const deleteButton = petFormBox.querySelector('.petpic_dbtn');
        let previewImg = petFormBox.querySelector(`#previewImg_pet_profile_${index}`);
        
        if (!previewImg) {
            previewImg = document.createElement('img');
            previewImg.id = `previewImg_pet_profile_${index}`;
            previewImg.className = 'preview-img';
            const label = petFormBox.querySelector('.petpic_label');
            if (label) label.appendChild(previewImg);
        }
        
        if (previewImg) {
            previewImg.src = imagePath;
            previewImg.style.display = 'block';
        }
        
        if (noImageElement) noImageElement.style.display = 'none';
        if (deleteButton) deleteButton.style.display = 'flex';
    }

    function createNewPetForm() {
        const originalPetFormBox = document.querySelector('.petform_box');
        const clonedPetFormBox = originalPetFormBox.cloneNode(true);
        
        clonedPetFormBox.id = `petform_box_${petFormCounter}`;
        
        const oldToNewIdMap = {};
        
        // ID 및 name 속성 업데이트
        clonedPetFormBox.querySelectorAll('[id], [name]').forEach(el => {
            const originalId = el.id;
            const originalName = el.name;
            
            let newId = originalId;
            let newName = originalName;
            
            if (originalId) {
                const idPatternMatch = originalId.match(/^(.*?)(\d+)$/);
                if (idPatternMatch) {
                    newId = `${idPatternMatch[1]}${petFormCounter}`;
                } else if (originalId.startsWith('petpic_upload')) {
                    newId = `petpic_upload_${petFormCounter}`;
                } else if (originalId.startsWith('petpic_label_id')) {
                    newId = `petpic_label_id_${petFormCounter}`;
                } else if (originalId.startsWith('petimg_id')) {
                    newId = `petimg_id_${petFormCounter}`;
                } else if (originalId.startsWith('petpic_dbtn_id')) {
                    newId = `petpic_dbtn_id_${petFormCounter}`;
                } else if (originalId.startsWith('petintroduction_')) {
                    newId = `petintroduction_${petFormCounter}`;
                }
                
                if (newId !== originalId) {
                    oldToNewIdMap[originalId] = newId;
                    el.id = newId;
                }
            }
            
            if (originalName) {
                const namePatternMatch = originalName.match(/^(.*?)(\d+)$/);
                if (namePatternMatch) {
                    newName = `${namePatternMatch[1]}${petFormCounter}`;
                }
                if (newName !== originalName) {
                    el.name = newName;
                }
            }
        });
        
        // label의 for 속성 업데이트
        clonedPetFormBox.querySelectorAll('label[for]').forEach(labelEl => {
            const currentFor = labelEl.getAttribute('for');
            if (currentFor && oldToNewIdMap[currentFor]) {
                labelEl.setAttribute('for', oldToNewIdMap[currentFor]);
            }
        });
        
        // 입력값 초기화
        clonedPetFormBox.querySelectorAll('input[type="text"], input[type="number"], textarea').forEach(input => input.value = '');
        clonedPetFormBox.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => input.checked = false);
        clonedPetFormBox.querySelectorAll('select').forEach(select => select.value = '0');
        
        // 이미지 상태 초기화
        clonedPetFormBox.querySelectorAll('.preview-img').forEach(img => img.remove());
        clonedPetFormBox.querySelectorAll('.petimg').forEach(img => {
            img.src = '../image/noimage.png';
            img.style.display = 'block';
        });
        clonedPetFormBox.querySelectorAll('.petpic_dbtn').forEach(btn => btn.style.display = 'none');
        
        // 등록 번호 필드 초기화
        const newRegistNumInput = clonedPetFormBox.querySelector(`#petnumber${petFormCounter}`);
        if (newRegistNumInput) {
            newRegistNumInput.disabled = true;
            newRegistNumInput.value = '';
        }
        
        // 이벤트 리스너 설정
        setupPetImageUpload(clonedPetFormBox, petFormCounter);
        setupPetRegistrationLogic(clonedPetFormBox, petFormCounter);
        
        // DOM에 추가
        const petFormButtonsDiv = document.getElementById('petform_id').querySelector('.buttons');
        document.getElementById('petform_id').insertBefore(clonedPetFormBox, petFormButtonsDiv);
    }

    // DOMContentLoaded 이벤트 리스너 안의 이벤트 리스너 들은 실행되는게 아닌 등록만 된다.

    function setupImageUpload(inputElement, noImageElement, deleteButtonElement, labelElement, previewIdPrefix) {
        inputElement.addEventListener('change', function(event) {
            const file = event.target.files[0]; // const file = inputElement.files[0]; 과 같다
            if (!file) return;

            const reader = new FileReader(); // java의 Scanner와 같이 파일을 읽어주는 도구
            reader.onload = function(e) { // FileReader.onload = function(){}은 파일읽기가 완료시 함수를 실행
                let previewImg = labelElement.querySelector(`#${previewIdPrefix}`); // `${}`문자열 안에 변수값을 쉽게 넣기위한 방법 ''은 안됨 ``만됨
                                                                                    // previewimg에 #label01 id를 가진 요소 안에 있는 #previewImg01 id를 가진 요소를 가져와서 저장하겠다.
                if (!previewImg) {      //previewImg 에 아무런값이 들어오지 못한경우
                    previewImg = document.createElement('img'); //perviewImg 변수에 <img>태그를 집어넣고
                    previewImg.id = previewIdPrefix;    //previewImg에 "previewImg01" 라는 id를 집어넣겠다
                    previewImg.className = 'preview-img';   //previewImg에 "preview-img" 라는 class를 집어넣겠다
                    labelElement.appendChild(previewImg);   //label01 id를 가진 요소에 previewImg 변수에 저장된 값을 넣겠다
                }                                       
                previewImg.src = e.target.result;           //reader에서 파일읽기 완료된 파일의 결과를 previewImg 변수의 src속성에 집어넣는다.

                noImageElement.style.display = 'none';
                deleteButtonElement.style.display = 'flex';
            };
            reader.readAsDataURL(file); //user_place_upload01 id를 가진 요소에서 선택된 파일을 읽고 base64 타입으로 변환 후 reader.result 에 자동저장후 reader.onload 함수 자동실행
        });

        deleteButtonElement.addEventListener('click', function(event) {
            event.preventDefault(); //폼제출 방지 및 버튼안에 링크가 있을시 링크 이동방지
            event.stopPropagation();    //x버튼을 눌렀을때 라벨이 실행되는것을 방지 삭제해야하는데 파일첨부창이뜨는것을 방지
            const previewImg = labelElement.querySelector(`#${previewIdPrefix}`); //x버튼 클릭시 previewImg01 id를 가진 요소를 perviewImg 변수에 저장
            if (previewImg) {   //previewImg에 값이 존재할시 삭제
                previewImg.remove();
            }
            inputElement.value = ''; //input type = "file" 에 값을 ''로 초기화
            noImageElement.style.display = 'block'; //noImage01 id의 요소를 css변경
            deleteButtonElement.style.display = 'none'; // deleteButton01 id의 요소를 css변경
        });
    }

    // 페이지 로드시 setupImgUpload함수 실행 매게 변수에는 아래와 같은 값을 집어넣는다.
    setupImageUpload(
        document.getElementById('user_place_upload01'),
        document.getElementById('noImage01'),
        document.getElementById('deleteButton01'),
        document.getElementById('label01'),
        'previewImg01'
    );

    // 페이지 로드시 setupImgUpload함수 실행 매게 변수에는 아래와 같은 값을 집어넣는다.
    setupImageUpload(
        document.getElementById('user_place_upload02'),
        document.getElementById('noImage02'),
        document.getElementById('deleteButton02'),
        document.getElementById('label02'),
        'previewImg02'
    );

    // 페이지 로드시 setupImgUpload함수 실행 매게 변수에는 아래와 같은 값을 집어넣는다.
    setupImageUpload(
        document.getElementById('userpic_upload'),
        document.getElementById('userimg_id'),
        document.getElementById('userpic_dbtn_id'),
        document.getElementById('userpic_label_id'),
        'previewImg_user_profile' 
    );

    // Function to set up pet image upload for a given pet details box
    function setupPetImageUpload(petDetailsBox, index) {        // 아래setupPetImageUpload(document.querySelector('.petform_box'), 1); 로 설명
        const uploadInput = petDetailsBox.querySelector('.petpic_file');    //uploadInput 변수에 petform_box클래스 안에 있는 petpic_file 클래스 이름을 가진 요소를 가져와서 저장한다.
        const noImage = petDetailsBox.querySelector('.petimg');             //noimage 변수에 petform_box클래스 안에있는 petimg 클래스 이름을 가진 요소를 가져와서 저장한다.
        const deleteButton = petDetailsBox.querySelector('.petpic_dbtn');   //deleteButton 변수에 petform_box클래스 안에있는 petpic_dbtn 클래스 이름을 가진 요소를 가져와서 저장한다.
        const label = petDetailsBox.querySelector('.petpic_label');         //label 변수에 petform_box클래스 안에있는 petpic_label 클래스 이름을 가진 요소를 가져와서 저장한다.
        const previewId = `previewImg_pet_profile_${index}`;                //previewId변수에 previewImg_pet_profile_1 문자열을 넣겠다.

        setupImageUpload(uploadInput, noImage, deleteButton, label, previewId); //setupImageUpload 함수에 위의 변수들의 값을 넣고 함수를 실행시키겠다.
    }

    // Initial setup for the first pet form's image upload
    setupPetImageUpload(document.querySelector('.petform_box'), 1); // setupPetImageUpload 함수에 petform_box 라는 클래스를 가진 요소와, 1 을 매개변수로 가지고 함수를 실행시키겠다.

    // Function to handle pet registration number enable/disable
    function setupPetRegistrationLogic(petDetailsBox, index) {     // 아래 setupPetRegistrationLogic(document.querySelector('.petform_box'), 1);로 설명    
        const registNumInput = petDetailsBox.querySelector(`#petnumber${index}`);   //petform_box이라는 클래스의 안에 있는 petnumber1 이라는 id를 가진 요소를 registNumInput변수에 저장하겠다.
        const registBtn01 = petDetailsBox.querySelector(`#petregister_yes_${index}`);   //petform_box이라는 클래스 안에있는 petregister_yes_1 이라는 id를 가진 요소를 registBtn01에 저장하겠다.
        const registBtn02 = petDetailsBox.querySelector(`#petregister_no_${index}`);    //petform_box이라는 클래스 안에있는 petregister_no_1 이라는 id를 가진 요소를 registBtn02에 저장 하겠다.

        if (registBtn01) {  //registBtn01 에 값이 있으면 실행
            registBtn01.addEventListener('change', function() { //registBtn01 radio가 변경될때 ex.선택됨 -> 선택안됨 or 선택안됨 -> 선택됨
                if (this.checked) { //registBtn01가 선택 됬을때
                    registNumInput.disabled = false;    //petnumber1,2,3.... 인덱스의 속성에 disabled를 비활성화한다(input type="number") 동물 등록번호 입력칸
                }
            });
        }

        if (registBtn02) { //registBtn02 에 값이 있으면 실행
            registBtn02.addEventListener('change', function() { //registBtn02 radio가 변경될때
                if (this.checked) { //registBtn02 가 선택 됬을때
                    registNumInput.disabled = true; //petnumber1,2,3.... 인덱스의 속성에 disabled를 활성화한다(input type="number") 동물 등록번호 입력칸
                    registNumInput.value = ''; // petnumber1,2,3.... 인덱스의 값을 초기화 한다. 동물 등록번호 입력칸 초기화
                }
            });
        }
        // 위는 함수를 정의만하고 등록만 시킨것이고 아래는 페이지 로드시 바로 실행되는 것(초기 설정)
        if (registBtn02 && registBtn02.checked) {
             registNumInput.disabled = true;
        } else if (registBtn01 && registBtn01.checked) {
            registNumInput.disabled = false;
        }
    }
    // Initial setup for the first pet form's registration logic
    setupPetRegistrationLogic(document.querySelector('.petform_box'), 1);   // setupPetRegistrationLogic함수안에 petform_box라는 클래스를 가진 요소와 1을 매개변수로 넣고 함수실행


    // Region selection logic
    const provinceSelect = document.getElementById('do');
    const citySelect = document.getElementById('city');

    provinceSelect.addEventListener('change', function(event) { //사용자가 select를 열고 option을 클릭시 실행되는 함수
        const selectedProvince = event.target.value;    // do라는 id를 갖진 요소의 값을 selectedProvince 변수에 저장하겠다.
        citySelect.innerHTML = '<option value="0" selected>구/시를 선택해주세요.</option>'; // city라는 id를 가진 요소에 innerHTML로 추가 하겠다.

        const cities = regions[selectedProvince];   //do라는 id를 가진 요소의 값의 이름을 가진 키를 regions에서 찾아 그 배열을 cities에 저장한다. 
        if (cities) {   //cities에 값이 있을때
            cities.forEach(city => {    //city라는 임시 변수에 cities 배열속 값들을 하나씩 대조하며 로직을 수행함
                const option = document.createElement('option');    // option이라는 변수에 option태그를 단다.
                option.value = city;    //option value에 대조하기위해 저장된 city값을 넣는다
                option.textContent = city;  //option 변수태그 사이 텍스트를 city값으로 넣는다.
                citySelect.appendChild(option); //city라는 id를 가진 요소의 자식으로 option변수를 집어 넣는다.
            });
        }
    });

    // --- Validation Functions ---

    function validateUserForm() {
        // User Profile Image
        const userPicUpload = document.getElementById('userpic_upload');
        const userPreviewImg = document.getElementById('previewImg_user_profile');

        // Name
        const userName = document.querySelector('.userform_box .userdetail01_box:nth-of-type(1) .userdetail01_textbox');
        //userform_box 클래스 안에 userdetail01_box 클래스를 가진 첫번째 자식의 안에 userdetail01_textbox 클래스를 가진 요소를 userName에 저장하겠다.

        if (!userName?.value.trim()) { // null-safe 연산자 추가
            alert('이름을 입력해주세요.');
            usertab.click();
            userName?.focus();
            return false;
        }

        // Age
        const userAge = document.querySelector('.userform_box .userdetail01_box:nth-of-type(2) .userdetail01_textbox');
        if (!userAge?.value.trim()) { // null-safe 연산자 추가
            alert('나이를 입력해주세요.');
            usertab.click();
            userAge?.focus();
            return false;
        }

        // Nickname
        const userNickname = document.querySelector('.userform_box .userdetail01_box02 .userdetail01_textbox');
        if (!userNickname?.value.trim()) { // null-safe 연산자 추가
            alert('닉네임을 입력해주세요.');
            usertab.click();
            userNickname?.focus();
            return false;
        }

        // Province
        const userProvince = document.getElementById('do');
        if (!userProvince || userProvince.value === '0') { // null 체크 추가
            alert('도/시를 선택해주세요.');
            usertab.click();
            userProvince?.focus();
            return false;
        }

        // City
        const userCity = document.getElementById('city');
        if (!userCity || userCity.value === '0' || userCity.value === '') { // null 체크 및 빈 문자열 체크 강화
            alert('구/시를 선택해주세요.');
            usertab.click();
            userCity?.focus();
            return false;
        }

        // Gender
        const userGender = document.querySelector('input[name="gender"]:checked');
        if (!userGender) {
            alert('성별을 선택해주세요.');
            usertab.click();
            document.getElementById('usermale')?.focus(); // null-safe 연산자 추가
            return false;
        }

        // Phone Number
        const userPhone = document.querySelector('.userdetail03_textbox');
        if (!userPhone?.value.trim()) { // null-safe 연산자 추가
            alert('핸드폰 번호를 입력해주세요.');
            usertab.click();
            userPhone?.focus();
            return false;
        }

        // 모든 사용자 폼 검사 성공
        return true;
    }

    function validatePetForm(petDetailsBox, index) {
        // Pet Profile Image
        const petPicUploadInput = petDetailsBox.querySelector('.petpic_file');
        const petPreviewImg = petDetailsBox.querySelector(`#previewImg_pet_profile_${index}`);
        if (!petPicUploadInput.files[0] && (!petPreviewImg || petPreviewImg.style.display === 'none' || petPreviewImg.src.includes('noimage.png'))) {
            alert(`반려동물 ${index}의 사진을 등록해주세요.`);
            pettab.click();
            petPicUploadInput.focus();
            return false;
        }

        // Name
        const petName = petDetailsBox.querySelector(`#petname_${index}`);
        if (!petName?.value.trim()) {   //trim()은 공백제거 ?는 옵셔널 체이닝 값이 없을시 null이 아닌 undefined로 값을 반환
                                        // 전체적인 의미는 petName의 값을 가져와 공백을 제거했을때 값이 없을경우 로직을 실행하고 petName이 null일 경우 undefined로 반환하겠다.

            // 1. if(!petName) - "변수의 값이 null인가?"
            // if(!petName) {
            //      petName 요소의 값이 null일경우에만 진행한다 빈칸이거나 공백일경우는 무시된다
            // }

            //  2. if(!petName.trim()) - "변수의 값에 공백을 제거했을때 빈칸인가?"
            // if(!petName.trim()) {
            //      petName 요소의 값에 공백을 제거했을때 빈칸이 경우에만 진행되고 null일경우 에러발생
            //      trim()의 경우 문자열에만 사용가능하나 숫자는 안됨 하지만 html은 입력을 전부 문자열로 받기때문에 신경X
            // }

            //  3. if(!petName.value) - "변수의 값이 빈칸인가?"
            // if(!petName.value) {
            //      petName 요소의 값이 빈칸일경우 진행 공백은 있는걸로 인식 null일 경우 에러발생
            //      trim()의 경우 문자열에만 사용가능하나 숫자는 안됨 하지만 html은 입력을 전부 문자열로 받기때문에 신경X
            // }

            //  4. if(!petName.value.trim()) - "변수의 값에 공백을 제거했을때 빈칸인가?"
            // if(!petName.value.trim()) {
            //      petName 요소의 값을 가져와 공백을 제거했을때 빈칸인 경우 실행 null일 경우 에러발생
            //      trim()의 경우 문자열에만 사용가능하나 숫자는 안됨 하지만 html은 입력을 전부 문자열로 받기때문에 신경X
            // }

            //  5. if(!petName?.value.trim()) - "변수의 값에 공백을 제거했을때 빈칸인가? 혹시나 null일경우 undefined로 반환되서 에러없이 if 로직이 실행됨"
            // if(!petName?.value.trim()) {
            //      petName 요소의 값을 가져와 공백을 제거했을때 빈칸인 경우 실행 null일 경우 petName 변수값은 null이지만 출력할때 undefined로 함
            //      trim()의 경우 문자열에만 사용가능하나 숫자는 안됨 하지만 html은 입력을 전부 문자열로 받기때문에 신경X
            // }

            //옵셔널 체이닝은 값이 null일때 오류가나는 코드에 ?를 집어넣어 변수값이 null일때 메소드나 로직을 수행할때는 수행하지 않고 흐름을 이어가며 출력할때는 undefined를 내보냄
            //마치 java의 exception e 와 같음
            
            alert(`반려동물 ${index}의 이름을 입력해주세요.`);
            pettab.click();
            petName?.focus();   //petName이 null일경우 .focus() 메소드를 실행하지 않고 변수값은 null이지만 출력할때 undefined로 함
            return false;
        }

        // Type (Breed)
        const petType = petDetailsBox.querySelector(`#pettype_${index}`);
        if (!petType?.value.trim()) {
            alert(`반려동물 ${index}의 종을 입력해주세요.`);
            pettab.click();
            petType?.focus();
            return false;
        }

        // Gender
        const petGender = petDetailsBox.querySelector(`input[name="petgender_${index}"]:checked`);
        if (!petGender) {
            alert(`반려동물 ${index}의 성별을 선택해주세요.`);
            pettab.click();
            petDetailsBox.querySelector(`#petmale_${index}`)?.focus();
            return false;
        }

        // Age (Year)
        const petYear = petDetailsBox.querySelector(`#petyear_${index}`);
        if (!petYear || petYear.value === '0') {
            alert(`반려동물 ${index}의 나이(연)를 선택해주세요.`);
            pettab.click();
            petYear?.focus();
            return false;
        }

        // Age (Month)
        const petMonth = petDetailsBox.querySelector(`#petmonth_${index}`);
        if (!petMonth || petMonth.value === '0') {
            alert(`반려동물 ${index}의 나이(개월)를 선택해주세요.`);
            pettab.click();
            petMonth?.focus();
            return false;
        }

        // Neutering Status
        const petNeutering = petDetailsBox.querySelector(`input[name="neutering_${index}"]:checked`);
        if (!petNeutering) {
            alert(`반려동물 ${index}의 중성화 여부를 선택해주세요.`);
            pettab.click();
            petDetailsBox.querySelector(`#neutering01_${index}`)?.focus();
            return false;
        }

        // Registration Status and Number
        const petRegister = petDetailsBox.querySelector(`input[name="petregister_${index}"]:checked`);
        if (!petRegister) {
            alert(`반려동물 ${index}의 등록 여부를 선택해주세요.`);
            pettab.click();
            petDetailsBox.querySelector(`#petregister_yes_${index}`)?.focus();
            return false;
        }
        if (petRegister.value === '예') {
            const petNumber = petDetailsBox.querySelector(`#petnumber${index}`);
            if (!petNumber?.value.trim()) {
                alert(`반려동물 ${index}의 등록번호를 입력해주세요.`);
                pettab.click();
                petNumber?.focus();
                return false;
            }
        }

        // Weight
        const petWeight = petDetailsBox.querySelector(`input[name="petweight_${index}"]:checked`);
        if (!petWeight) {
            alert(`반려동물 ${index}의 몸무게를 선택해주세요.`);
            pettab.click();
            petDetailsBox.querySelector(`#petweight01_${index}`)?.focus();
            return false;
        }

        // 모든 특정 반려동물 폼 검사 성공
        return true;
    }

    // **제거:** userCheck, petCheck 전역 변수는 사용되지 않습니다.
    // **제거:** userFormCheck() 및 petFormCheck() 함수는 이제 사용되지 않습니다.

    // 최종 유효성 검사 및 저장 함수 (모든 폼의 유효성 검사를 중앙에서 제어)
    function validateAndSaveAllForms() {
        // 1. 사용자 폼의 필수 입력 사항 검사 및 탭 이동
        if (!validateUserForm()) {
            return; // 사용자 폼이 유효하지 않으면 여기서 종료
        }

        // 2. 반려동물 폼의 최소 1개 이상 작성 여부 검사
        const petDetailsBoxes = document.querySelectorAll('.petform_box');
        if (petDetailsBoxes.length === 0) {
            alert('반려동물 프로필을 1개 이상 작성해야 합니다.');
            pettab.click(); // 반려동물 탭으로 이동
            return; // 함수 종료
        }

        // 3. 각 반려동물 폼의 필수 입력 사항 순회 검사 및 탭 이동
        for (let i = 0; i < petDetailsBoxes.length; i++) {
            const petIndex = i + 1; // 1부터 시작하는 인덱스
            if (!validatePetForm(petDetailsBoxes[i], petIndex)) {
                return; // 현재 반려동물 폼이 유효하지 않으면 여기서 종료
            }
        }

        // 4. 모든 유효성 검사를 통과했을 경우, 데이터 저장 및 페이지 이동
        saveFormDataToLocalStorage();
        alert('프로필 수정이 완료되었습니다!');
        localStorage.setItem("isLoggedIn", "true");
        loginCheck();
        location.href = '../Profile/Profile.html';
    }

    // Function to collect and save data to localStorage
    function saveFormDataToLocalStorage() {
        const userData = {};
        // Collect User Data (null-safe 연산자 및 기본값 추가)
        userData.name = document.querySelector('.userform_box .userdetail01_box:nth-of-type(1) .userdetail01_textbox')?.value.trim() || '';
        userData.age = document.querySelector('.userform_box .userdetail01_box:nth-of-type(2) .userdetail01_textbox')?.value.trim() || '';
        userData.nickname = document.querySelector('.userform_box .userdetail01_box02 .userdetail01_textbox')?.value.trim() || '';
        userData.province = document.getElementById('do')?.value || '0';
        userData.city = document.getElementById('city')?.value || '0';
        userData.detailAddress = document.querySelector('.userdetail02_textbox')?.value.trim() || '';
        userData.gender = document.querySelector('input[name="gender"]:checked')?.value || '';
        userData.phoneNumber = document.querySelector('.userdetail03_textbox')?.value.trim() || '';
        userData.oneCTime = document.querySelector('input[name="oncetime"]:checked')?.value || '';
        userData.mbti = document.querySelector('input[name="mbti"]:checked')?.value || '';
        userData.walkStyles = Array.from(document.querySelectorAll('input[name="walkstyle"]:checked')).map(cb => cb.value);
        userData.walkTimes = Array.from(document.querySelectorAll('input[name="walktime"]:checked')).map(cb => cb.value);
        userData.introduction = document.querySelector('.userdetail11_textarea')?.value.trim() || '';

        // User Profile Image Path (실제 이미지 경로만 저장, noimage.png는 제외)
        const userProfileImg = document.getElementById('previewImg_user_profile');
        const defaultUserImg = document.getElementById('userimg_id');
        userData.profileImagePath = (userProfileImg && userProfileImg.src && userProfileImg.style.display !== 'none' && !userProfileImg.src.includes('noimage.png')) ? userProfileImg.src : (defaultUserImg ? defaultUserImg.src : '');
        
        // Favorite Place Images (실제 이미지 경로만 저장, noimage.png는 제외)
        const userPlaceImg1 = document.getElementById('previewImg01');
        const userPlaceImg2 = document.getElementById('previewImg02');
        userData.favoritePlaceImages = [];
        if (userPlaceImg1 && userPlaceImg1.src && userPlaceImg1.style.display !== 'none' && !userPlaceImg1.src.includes('noimage.png')) userData.favoritePlaceImages.push(userPlaceImg1.src);
        if (userPlaceImg2 && userPlaceImg2.src && userPlaceImg2.style.display !== 'none' && !userPlaceImg2.src.includes('noimage.png')) userData.favoritePlaceImages.push(userPlaceImg2.src);

        localStorage.setItem('userProfile', JSON.stringify(userData));

        const petProfiles = [];
        document.querySelectorAll('.petform_box').forEach((petDetailsBox, i) => {
            const index = i + 1;
            const petData = {};
            const currentPetPreviewImg = petDetailsBox.querySelector(`#previewImg_pet_profile_${index}`);
            const defaultPetImg = petDetailsBox.querySelector(`#petimg_id_${index}`);

            petData.imagePath = (currentPetPreviewImg && currentPetPreviewImg.src && currentPetPreviewImg.style.display !== 'none' && !currentPetPreviewImg.src.includes('noimage.png')) ? currentPetPreviewImg.src : (defaultPetImg ? defaultPetImg.src : '');
            
            petData.name = petDetailsBox.querySelector(`#petname_${index}`)?.value.trim() || '';
            petData.type = petDetailsBox.querySelector(`#pettype_${index}`)?.value.trim() || '';
            petData.gender = petDetailsBox.querySelector(`input[name="petgender_${index}"]:checked`)?.value || '';
            petData.ageYear = petDetailsBox.querySelector(`#petyear_${index}`)?.value || '0';
            petData.ageMonth = petDetailsBox.querySelector(`#petmonth_${index}`)?.value || '0';
            petData.neutering = petDetailsBox.querySelector(`input[name="neutering_${index}"]:checked`)?.value || '';
            petData.registered = petDetailsBox.querySelector(`input[name="petregister_${index}"]:checked`)?.value || '';
            petData.registrationNumber = petDetailsBox.querySelector(`#petnumber${index}`)?.value.trim() || '';
            petData.weight = petDetailsBox.querySelector(`input[name="petweight_${index}"]:checked`)?.value || '';
            petData.personality = Array.from(petDetailsBox.querySelectorAll(`input[name="petpersonal_${index}"]:checked`)).map(cb => cb.value);
            petData.walkStyle = Array.from(petDetailsBox.querySelectorAll(`input[name="petwalkstyle_${index}"]:checked`)).map(cb => cb.value);
            petData.introduction = petDetailsBox.querySelector(`#petintroduction_${index}`)?.value.trim() || '';

            petProfiles.push(petData);
        });
        localStorage.setItem('petProfiles', JSON.stringify(petProfiles));
    }

    // --- Dynamic Pet Form Addition ---
    const addPetButton = document.querySelector('.petform .form_btn:nth-child(2)'); // "반려동물 추가" button

    addPetButton.addEventListener('click', function() {
        petFormCounter++;
        const originalPetFormBox = document.querySelector('.petform_box');
        const clonedPetFormBox = originalPetFormBox.cloneNode(true);

        clonedPetFormBox.id = `petform_box_${petFormCounter}`; // 컨테이너에 고유 ID 할당

        const oldToNewIdMap = {}; // Step 1: oldId -> newId 매핑을 위한 객체 생성

        // 첫 번째 단계: ID 및 name 속성 업데이트 및 매핑 구축
        // id 또는 name 속성을 가질 수 있는 모든 요소를 쿼리합니다.
        clonedPetFormBox.querySelectorAll('[id], [name]').forEach(el => {
            const originalId = el.id;
            const originalName = el.name;

            let newId = originalId;
            let newName = originalName;

            // ID가 숫자 패턴을 따르는 경우 업데이트
            if (originalId) {
                const idPatternMatch = originalId.match(/^(.*?)(\d+)$/); // 예: petname_1 -> petname_
                if (idPatternMatch) {
                    newId = `${idPatternMatch[1]}${petFormCounter}`;
                } else if (originalId.startsWith('petpic_upload')) {
                    newId = `petpic_upload_${petFormCounter}`;
                } else if (originalId.startsWith('petpic_label_id')) {
                    newId = `petpic_label_id_${petFormCounter}`;
                } else if (originalId.startsWith('petimg_id')) {
                    newId = `petimg_id_${petFormCounter}`;
                } else if (originalId.startsWith('petpic_dbtn_id')) {
                    newId = `petpic_dbtn_id_${petFormCounter}`;
                } else if (originalId.startsWith('petintroduction_')) { // petintroduction_1와 같이 _숫자 형태
                    newId = `petintroduction_${petFormCounter}`;
                }

                // ID가 실제로 변경된 경우에만 매핑 저장 및 요소 ID 업데이트
                if (newId !== originalId) {
                    oldToNewIdMap[originalId] = newId;
                    el.id = newId; // 요소의 ID 업데이트
                }
            }

            // name 속성 업데이트 (라디오/체크박스 그룹의 고유성을 위해 중요)
            if (originalName) {
                const namePatternMatch = originalName.match(/^(.*?)(\d+)$/); // 예: petgender_1 -> petgender_
                if (namePatternMatch) {
                    newName = `${namePatternMatch[1]}${petFormCounter}`;
                }
                if (newName !== originalName) {
                    el.name = newName; // 요소의 name 속성 업데이트
                }
            }
        });

        // 두 번째 단계: 매핑을 사용하여 label 요소의 'for' 속성 업데이트
        clonedPetFormBox.querySelectorAll('label[for]').forEach(labelEl => {
            const currentFor = labelEl.getAttribute('for'); // 현재 label의 for 속성 값 (예: petmale_1)
            if (currentFor && oldToNewIdMap[currentFor]) {
                // 매핑에서 새로운 ID를 찾아 label의 for 속성 업데이트 (예: petmale_2)
                labelEl.setAttribute('for', oldToNewIdMap[currentFor]);
            }
        });

        // input 값 초기화, 라디오/체크박스 해제, select 초기화
        clonedPetFormBox.querySelectorAll('input[type="text"], input[type="number"], textarea').forEach(input => input.value = '');
        clonedPetFormBox.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => input.checked = false);
        clonedPetFormBox.querySelectorAll('select').forEach(select => select.value = '0'); // 기본값 "선택해주세요"로 초기화

        // 이미지 미리보기 및 삭제 버튼 상태 초기화
        clonedPetFormBox.querySelectorAll('.preview-img').forEach(img => img.remove()); // 기존 미리보기 이미지 제거
        clonedPetFormBox.querySelectorAll('.petimg').forEach(img => {
            img.src = '../image/noimage.png'; // 기본 no-image 이미지로 설정
            img.style.display = 'block'; // 숨겨져 있었다면 다시 보이도록
        });
        clonedPetFormBox.querySelectorAll('.petpic_dbtn').forEach(btn => btn.style.display = 'none'); // 삭제 버튼 숨기기


        // 반려동물 등록 번호 입력 필드를 비활성화 및 빈 값으로 초기화
        const newRegistNumInput = clonedPetFormBox.querySelector(`#petnumber${petFormCounter}`);
        if (newRegistNumInput) {
            newRegistNumInput.disabled = true;
            newRegistNumInput.value = '';
        }

        // 새로운 요소들에 대한 이벤트 리스너 다시 설정
        setupPetImageUpload(clonedPetFormBox, petFormCounter);
        setupPetRegistrationLogic(clonedPetFormBox, petFormCounter);

        // petform_id 내의 "buttons" div를 찾아서 그 앞에 새 폼을 삽입
        const petFormButtonsDiv = petform.querySelector('.buttons');
        petform.insertBefore(clonedPetFormBox, petFormButtonsDiv);

        alert(`새로운 반려동물 프로필이 추가되었습니다!`);
    });

    // --- Form Action Buttons ---
    // User Form Cancel Button
    document.querySelector('.userform .form_btn:first-child').addEventListener('click', function() {
        if (confirm('작성 중인 내용이 사라질 수 있습니다. 정말 취소하시겠습니까?')) {
            location.href = '../signup/signup.html';
        }
    });

    // Pet Form Cancel Button (there's only one, inside the main petform)
    document.querySelector('.petform .form_btn:first-child').addEventListener('click', function() {
        if (confirm('작성 중인 내용이 사라질 수 있습니다. 정말 취소하시겠습니까?')) {
            location.href = '../signup/signup.html';
        }
    });

    // User Form Submit Button (handles validation for both user and all pets)
    document.querySelector('.userform .form_btn[type="submit"]').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default HTML form submission
        validateAndSaveAllForms(); // 모든 폼의 유효성 검사 및 저장 시작
    });

    // Pet Form Submit Button (handles validation for both user and all pets)
    document.querySelector('.petform .form_btn[type="submit"]').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default HTML form submission
        validateAndSaveAllForms(); // 모든 폼의 유효성 검사 및 저장 시작
    });

    loginCheck(); // Run login check on page load
});