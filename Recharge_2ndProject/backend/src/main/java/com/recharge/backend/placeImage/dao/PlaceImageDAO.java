package com.recharge.backend.placeImage.dao;

import com.recharge.backend.placeImage.vo.PlaceImageVO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PlaceImageDAO {

    PlaceImageVO findImageByName(String placeName);

    int insertImage(PlaceImageVO vo);
}
