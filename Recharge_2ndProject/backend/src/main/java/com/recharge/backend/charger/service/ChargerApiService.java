package com.recharge.backend.charger.service;

import com.recharge.backend.charger.vo.ChargerVO;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ChargerApiService {

    @Value("${evapi.base-url}")
    private String baseUrl;

    @Value("${evapi.key}")
    private String serviceKey;

    @Value("${evapi.type}")
    private String dataType;

    // -----------------------
    //    단일 API test
    // -----------------------
    public String testCall() {
        try {
            String url = baseUrl
                    + "?serviceKey=" + serviceKey
                    + "&pageNo=1"
                    + "&numOfRows=1"
                    + "&dataType=" + dataType;

            return new RestTemplate().getForObject(url, String.class);

        } catch (Exception e) {
            e.printStackTrace();
            return "API 호출 실패: " + e.getMessage();
        }
    }

    // --------------------------
    //     충남 전체 호출
    // --------------------------
    public String allSave() {
        try {
            String url = baseUrl
                    + "?serviceKey=" + serviceKey
                    + "&pageNo=1"
                    + "&numOfRows=9999"
                    + "&zcode=44"
                    + "&dataType=" + dataType;

            return new RestTemplate().getForObject(url, String.class);

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // --------------------------
    // totalCount (안정적 파싱)
    // --------------------------
    private int getTotalCount() {
        try {
            String url = baseUrl
                    + "?serviceKey=" + serviceKey
                    + "&pageNo=1"
                    + "&numOfRows=1"
                    + "&zcode=44"
                    + "&dataType=" + dataType;

            String json = new RestTemplate().getForObject(url, String.class);
            JSONObject root = new JSONObject(json);

            // 1. JSON 응답 형태
            if (root.has("totalCount")) {
                return root.optInt("totalCount", 0);
            }

            // 2. XML→JSON 구조
            if (root.has("response")) {
                JSONObject response = root.getJSONObject("response");
                JSONObject header = response.optJSONObject("header");
                if (header != null) {
                    return header.optInt("totalCount", 0);
                }
            }

            return 0;

        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    // --------------------------
    //       parseChargers()
    // --------------------------
    public List<ChargerVO> parseChargers() {
        System.out.println("🚨 parseChargers() 호출됨");

        List<ChargerVO> list = new ArrayList<>();

        int total = getTotalCount();      // 전체 충전기 수
        int numOfRows = 9999;             // 한번에 가져올 수 있는 최대 수
        int totalPage = (int) Math.ceil(total / (double) numOfRows);

        // 페이지 루프
        for (int page = 1; page <= totalPage; page++) {
            try {
                String url = baseUrl
                        + "?serviceKey=" + serviceKey
                        + "&pageNo=" + page
                        + "&numOfRows=" + numOfRows
                        + "&zcode=44"
                        + "&dataType=" + dataType;

                String json = new RestTemplate().getForObject(url, String.class);
                JSONObject root = new JSONObject(json);

                //------------------------------
                // items → item 배열 가져오기
                //------------------------------
                JSONArray itemList = null;

                // ① JSON 방식
                if (root.has("items")) {
                    JSONObject items = root.getJSONObject("items");
                    itemList = items.optJSONArray("item");

                    // ② XML → JSON 방식
                } else if (root.has("response")) {
                    JSONObject response = root.getJSONObject("response");
                    JSONObject body = response.optJSONObject("body");
                    if (body != null && body.has("items")) {
                        JSONObject items = body.getJSONObject("items");
                        itemList = items.optJSONArray("item");
                    }
                }

                if (itemList == null) {
                    System.out.println("⚠ item 배열 없음 → page=" + page);
                    continue;
                }

                //------------------------------
                //      배열 파싱
                //------------------------------
                for (int i = 0; i < itemList.length(); i++) {

                    JSONObject item = itemList.getJSONObject(i);

                    ChargerVO vo = new ChargerVO();
                    vo.setChargerId(item.optString("chgerId", null));
                    vo.setStationId(item.optString("statId", null));
                    vo.setChargerProvider(item.optString("busiNm", null));
                    vo.setChargerType(item.optString("chgerType", null));

                    // output (속도)
                    String outputStr = item.optString("output", null);
                    if (outputStr != null && outputStr.trim().isEmpty()) outputStr = null;
                    vo.setChargerSpeed(outputStr);

                    vo.setStatus(item.optString("stat", null));

                    // total은 마지막에 계산
                    vo.setChargerTotal(null);

                    vo.setCreateId("ADMIN");
                    vo.setUpdateId("SYSTEM");

                    list.add(vo);
                }

                System.out.println("페이지 " + page + " / " + totalPage + " 완료");

            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        // ----------------------------
        // stationId 별 total 계산
        // ----------------------------
        Map<String, List<ChargerVO>> grouped =
                list.stream().collect(Collectors.groupingBy(ChargerVO::getStationId));

        for (String stationId : grouped.keySet()) {
            int chargerTotal = grouped.get(stationId).size();
            for (ChargerVO vo : grouped.get(stationId)) {
                vo.setChargerTotal(chargerTotal);
            }
        }

        System.out.println("==== 그룹핑 완료 ====");
        System.out.println("총 station 개수 = " + grouped.size());
        System.out.println("총 charger 개수 = " + list.size());

        return list;
    }

    // --------------------------
    //   (기존) 충남 전체 실시간
    // --------------------------
    public List<ChargerVO> fetchRealTimeStatus() {
        System.out.println("⭐⭐⭐ [환경부 상태 API 호출됨!!!] ⭐⭐⭐");

        List<ChargerVO> list = new ArrayList<>();

        try {
            String url = baseUrl
                    + "?serviceKey=" + serviceKey
                    + "&pageNo=1"
                    + "&numOfRows=9999"
                    + "&zcode=44"
                    + "&dataType=" + dataType;

            String json = new RestTemplate().getForObject(url, String.class);

            JSONObject root = new JSONObject(json);
            JSONArray itemList = null;

            // JSON 방식
            if (root.has("items")) {
                itemList = root.getJSONObject("items").optJSONArray("item");

                // XML → JSON 방식
            } else if (root.has("response")) {
                JSONObject response = root.getJSONObject("response");
                JSONObject body = response.optJSONObject("body");
                if (body != null && body.has("items")) {
                    JSONObject items = body.getJSONObject("items");
                    itemList = items.optJSONArray("item");
                }
            }

            if (itemList == null) return list;

            for (int i = 0; i < itemList.length(); i++) {

                JSONObject item = itemList.getJSONObject(i);

                ChargerVO vo = new ChargerVO();
                vo.setStationId(item.optString("statId", null));  // 필수
                vo.setChargerId(item.optString("chgerId", null)); // 필수
                vo.setStatus(item.optString("stat", "0"));        // 실시간 상태

                list.add(vo);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return list;
    }

    // --------------------------
    //  🔥 추가: 특정 statId만 실시간 조회
    // --------------------------
    public List<ChargerVO> fetchRealTimeStatusByStation(String stationId) {

        List<ChargerVO> list = new ArrayList<>();

        try {
            String url = baseUrl
                    + "?serviceKey=" + serviceKey
                    + "&statId=" + stationId   // ✅ 특정 충전소만
                    + "&dataType=" + dataType;

            String json = new RestTemplate().getForObject(url, String.class);

            JSONObject root = new JSONObject(json);
            JSONArray itemList = null;

            // JSON 방식
            if (root.has("items")) {
                itemList = root.getJSONObject("items").optJSONArray("item");

                // XML → JSON 방식
            } else if (root.has("response")) {
                JSONObject response = root.getJSONObject("response");
                JSONObject body = response.optJSONObject("body");
                if (body != null && body.has("items")) {
                    JSONObject items = body.getJSONObject("items");
                    itemList = items.optJSONArray("item");
                }
            }

            if (itemList == null) return list;

            for (int i = 0; i < itemList.length(); i++) {

                JSONObject item = itemList.getJSONObject(i);

                ChargerVO vo = new ChargerVO();
                vo.setStationId(item.optString("statId", null));
                vo.setChargerId(item.optString("chgerId", null));
                vo.setStatus(item.optString("stat", "0"));

                list.add(vo);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return list;
    }
}
