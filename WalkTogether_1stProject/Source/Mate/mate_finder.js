document.addEventListener('DOMContentLoaded', function() {
  const regions = {
    '서울시': ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'], // 서울특별시
    '제주도': ['서귀포시', '제주시'], // 제주특별자치도
    '경기도': ['가평군', '고양시', '과천시', '광명시', '광주시', '구리시', '군포시', '김포시', '남양주시', '동두천시', '부천시', '성남시', '수원시', '시흥시', '안산시', '안성시', '안양시', '양주시', '여주시', '오산시', '용인시', '의왕시', '의정부시', '이천시', '파주시', '평택시', '포천시', '하남시', '화성시'], // 경기도
    '경상남도': ['거제시', '김해시', '밀양시', '사천시', '양산시', '진주시', '창원시', '통영시'], // 경상남도
    '경상북도': ['경산시', '경주시', '구미시', '김천시', '문경시', '상주시', '안동시', '영주시', '영천시', '포항시'], // 경상북도
    '강원도': ['강릉시', '동해시', '삼척시', '속초시', '원주시', '춘천시', '태백시'], // 강원도
    '전라남도': ['광양시', '나주시', '목포시', '순천시', '여수시'], // 전라남도
    '충청남도': ['계룡시', '공주시', '논산시', '당진시', '보령시', '서산시', '아산시', '천안시'], // 충청남도
    '충청북도': ['제천시', '청주시', '충주시'] // 충청북도
  };

  const provinceSelect = document.getElementById('do');
  const citySelect = document.getElementById('city');

  provinceSelect.addEventListener('change', function() {
    const selectedValue = this.value;
    
    // 구/시 select 초기화
    citySelect.innerHTML = '<option value="0" selected>구/시를 선택해주세요.</option>';

    // 선택한 도/시가 regions에 있는지 확인
    if (regions[selectedValue]) {
      regions[selectedValue].forEach(function(city) {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
      });
    }
  });

function serializeAllForms(rootEl) {
        const data = {};
        const fields = rootEl.querySelectorAll('input, select, textarea');

        fields.forEach((el) => {
            const baseKey = (el.name && el.name.trim()) || (el.id && el.id.trim());
            if (!baseKey) return;

            const scope =
                el.closest('.human') ? 'human' :
                el.closest('.dog') ? 'dog' : null;

            const key = scope ? `${scope}.${baseKey}` : baseKey;
            const type = (el.type || '').toLowerCase();

            if (type === 'checkbox') {
                if (!el.checked) return;
                if (!Array.isArray(data[key])) data[key] = [];
                data[key].push(el.value);
                return;
            }

            if (type === 'radio') {
                if (!el.checked) return;
                data[key] = el.value; // 섹션 프리픽스로 그룹 충돌 방지
                return;
            }

            data[key] = el.value;
        });

        return data;
    }

    // 3) 제출용 폼 찾기 (하단 "메이트 찾기" 버튼 포함 폼) → 저장 후 이동
    const submitDiv = document.querySelector('.submit_button'); // mate_finder.html 하단 영역:contentReference[oaicite:2]{index=2}
    let submitForm = submitDiv ? submitDiv.closest('form') : null;

    if (!submitForm) {
        const allForms = Array.from(document.querySelectorAll('main form'));
        if (allForms.length) submitForm = allForms[allForms.length - 1];
    }
    if (!submitForm) return;

    submitForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // main 영역 기준으로 모든 입력값 수집
        const scope = document.querySelector('main') || document.body;
        const allFormData = serializeAllForms(scope);

        // 지역의 표시 텍스트도 함께 저장 (표시용)
        if (provinceSelect) {
            allFormData._provinceText =
                provinceSelect.options[provinceSelect.selectedIndex]?.textContent || '';
        }
        if (citySelect) {
            allFormData._cityText = citySelect.value || '';
        }

        // 로컬스토리지 저장 및 이동
        localStorage.setItem('mateData', JSON.stringify(allFormData));
        window.location.href = 'mate_list.html';
    });
  });