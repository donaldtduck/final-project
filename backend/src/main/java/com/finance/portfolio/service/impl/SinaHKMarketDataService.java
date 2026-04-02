package com.finance.portfolio.service.impl;

import com.finance.portfolio.model.dto.StockQueryDto;
import com.finance.portfolio.model.vo.StockHistoryVo;
import com.finance.portfolio.service.MarketDataService;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service("sinaHKMarketDataService")
public class SinaHKMarketDataService implements MarketDataService {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final DateTimeFormatter DAY_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final String QOS_API_KEY = "420a4c72c64bb84400676b9dec7b301b";

    // ================================
    // QOS 官方 K线（完全正确）
    // ================================
    @Override
    public List<StockHistoryVo> getStockHistory(StockQueryDto dto) {
        String code = convertToQosHk(dto.getSymbol());

        try {
            String url = "https://api.qos.hk/kline?key=" + QOS_API_KEY;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> reqBody = new HashMap<>();
            List<Map<String, Object>> reqs = new ArrayList<>();

            Map<String, Object> klineReq = new HashMap<>();
            klineReq.put("c", code);
            klineReq.put("co", 1);
            klineReq.put("a", 0);
            klineReq.put("kt", 1001);

            reqs.add(klineReq);
            reqBody.put("kline_reqs", reqs);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(reqBody, headers);
            ResponseEntity<Map> resp = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
            Map<String, Object> body = resp.getBody();

            if (body == null || !body.containsKey("data")) {
                return Collections.emptyList();
            }

            List<Map<String, Object>> dataList = (List<Map<String, Object>>) body.get("data");
            List<StockHistoryVo> list = new ArrayList<>();

            for (Map<String, Object> data : dataList) {
                List<List<Object>> klines = (List<List<Object>>) data.get("klines");
                for (List<Object> line : klines) {
                    LocalDate day = LocalDate.parse(line.get(0).toString(), DAY_FMT);
                    BigDecimal open = new BigDecimal(line.get(1).toString());
                    BigDecimal high = new BigDecimal(line.get(2).toString());
                    BigDecimal low = new BigDecimal(line.get(3).toString());
                    BigDecimal close = new BigDecimal(line.get(4).toString());
                    long vol = ((Number) line.get(5)).longValue();

                    list.add(new StockHistoryVo(day, open, high, low, close, vol));
                }
            }

            return list.stream()
                    .filter(vo -> !vo.getDay().isBefore(dto.getStartDate()) && !vo.getDay().isAfter(dto.getEndDate()))
                    .sorted(Comparator.comparing(StockHistoryVo::getDay))
                    .toList();

        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    // ================================
    // 【修复】快照 —— 真实字段名，无空指针
    // ================================
    @Override
    public BigDecimal getCurrentPrice(String symbol) {
        String code = convertToQosHk(symbol);
        try {
            String url = "https://api.qos.hk/snapshot?key=" + QOS_API_KEY;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> reqBody = new HashMap<>();
            List<String> codes = new ArrayList<>();
            codes.add(code);
            reqBody.put("codes", codes);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(reqBody, headers);
            ResponseEntity<Map> resp = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
            Map<String, Object> body = resp.getBody();

            if (body == null || !body.containsKey("data")) return BigDecimal.ZERO;

            List<Map<String, Object>> dataList = (List<Map<String, Object>>) body.get("data");
            if (dataList.isEmpty()) return BigDecimal.ZERO;

            Map<String, Object> item = dataList.get(0);

            // 【修复】从 map 中安全获取，不强制转 double
            Object priceObj = item.get("last");
            if (priceObj == null) return BigDecimal.ZERO;

            return new BigDecimal(priceObj.toString());

        } catch (Exception e) {
            e.printStackTrace();
            return BigDecimal.ZERO;
        }
    }

    @Override
    public BigDecimal getLastClosePrice(String symbol) {
        String code = convertToQosHk(symbol);
        try {
            String url = "https://api.qos.hk/snapshot?key=" + QOS_API_KEY;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> reqBody = new HashMap<>();
            List<String> codes = new ArrayList<>();
            codes.add(code);
            reqBody.put("codes", codes);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(reqBody, headers);
            ResponseEntity<Map> resp = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
            Map<String, Object> body = resp.getBody();

            if (body == null || !body.containsKey("data")) return BigDecimal.ZERO;

            List<Map<String, Object>> dataList = (List<Map<String, Object>>) body.get("data");
            if (dataList.isEmpty()) return BigDecimal.ZERO;

            Map<String, Object> item = dataList.get(0);

            // 【修复】安全获取
            Object preCloseObj = item.get("pre_close");
            if (preCloseObj == null) return BigDecimal.ZERO;

            return new BigDecimal(preCloseObj.toString());

        } catch (Exception e) {
            e.printStackTrace();
            return BigDecimal.ZERO;
        }
    }

    // ================================
    // 按日期获取收盘价
    // ================================
    @Override
    public BigDecimal getClosePriceByDate(String symbol, LocalDateTime dateTime) {
        LocalDate target = dateTime.toLocalDate();
        List<StockHistoryVo> history = getStockHistory(new StockQueryDto(
                symbol, target.minusDays(60), target.plusDays(1), "240"));

        return history.stream()
                .filter(vo -> vo.getDay().equals(target))
                .findFirst()
                .map(StockHistoryVo::getClose)
                .orElse(BigDecimal.ZERO);
    }

    // ================================
    // 港股代码转换
    // ================================
    private String convertToQosHk(String input) {
        String num = input.replaceAll("[^0-9]", "");
        while (num.length() < 5) num = "0" + num;
        return "HK:" + num;
    }
}