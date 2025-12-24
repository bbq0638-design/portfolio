package com.recharge.backend.placeImage.service;

import com.recharge.backend.placeImage.dao.PlaceImageDAO;
import com.recharge.backend.placeImage.util.KakaoImageSearch;
import com.recharge.backend.placeImage.vo.PlaceImageVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PlaceImageService {

    private final PlaceImageDAO placeImageDAO;
    private final KakaoImageSearch kakaoImageSearch;

    public String getImage(String placeName) {

        // 1) DB 확인
        PlaceImageVO saved = placeImageDAO.findImageByName(placeName);
        if (saved != null) {
            return saved.getImageUrl();
        }

        // 2) DB에 없으면 카카오 API 검색
        String imageUrl = kakaoImageSearch.searchImage(placeName);
        if (imageUrl != null) {
            PlaceImageVO vo = new PlaceImageVO();
            vo.setPlaceName(placeName);
            vo.setImageUrl(imageUrl);
            placeImageDAO.insertImage(vo);
        }

        return imageUrl;
    }
}
