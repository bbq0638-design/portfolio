package com.recharge.backend.music.dao;

import com.recharge.backend.music.vo.MusicVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MusicDAO {
    int upsertBulk(@Param("list") List<MusicVO> list);
    List<MusicVO> searchFromDb(@Param("keyword") String keyword);
    List<MusicVO> selectTopChartFromDb();
}
