package com.finance.portfolio.util;

import com.finance.portfolio.model.dto.StockQueryDto;
import com.finance.portfolio.model.vo.StockHistoryVo;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class SinaStockApiUtil {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final DateTimeFormatter DAY_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    /**
     * 获取指定时间段内的股票历史K线数据
     */
    public List<StockHistoryVo> getStockHistory(StockQueryDto dto) {
        String symbol = dto.getSymbol();
        LocalDate start = dto.getStartDate();
        LocalDate end = dto.getEndDate();
        String scale = dto.getScale();

        String url = "https://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData"
                + "?symbol=" + symbol
                + "&scale=" + scale
                + "&ma=no"
                + "&datalen=1023";

        List<Map<String, String>> rawList = restTemplate.getForObject(url, List.class);
        if (rawList == null || rawList.isEmpty()) {
            return Collections.emptyList();
        }

        return rawList.stream()
                .map(map -> {
                    LocalDate day = LocalDate.parse(map.get("day"), DAY_FMT);
                    BigDecimal open = new BigDecimal(map.get("open"));
                    BigDecimal high = new BigDecimal(map.get("high"));
                    BigDecimal low = new BigDecimal(map.get("low"));
                    BigDecimal close = new BigDecimal(map.get("close"));
                    Long volume = Long.valueOf(map.get("volume"));
                    return new StockHistoryVo(day, open, high, low, close, volume);
                })
                .filter(vo -> !vo.getDay().isBefore(start) && !vo.getDay().isAfter(end))
                .sorted(Comparator.comparing(StockHistoryVo::getDay))
                .collect(Collectors.toList());
    }

    // ===================== 你要的新功能：根据日期获取当日收盘价 =====================
    public BigDecimal getClosePriceByDate(String symbol, LocalDateTime dateTime) {
        LocalDate targetDate = dateTime.toLocalDate();

        // 新浪获取最近1000天数据
        String url = "https://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData"
                + "?symbol=" + symbol
                + "&scale=240"
                + "&ma=no"
                + "&datalen=1023";

        try {
            List<Map<String, String>> rawList = restTemplate.getForObject(url, List.class);
            if (rawList == null || rawList.isEmpty()) {
                return BigDecimal.ZERO;
            }

            for (Map<String, String> map : rawList) {
                LocalDate day = LocalDate.parse(map.get("day"), DAY_FMT);
                if (day.equals(targetDate)) {
                    return new BigDecimal(map.get("close"));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return BigDecimal.ZERO;
    }


    // ---------------- 我给你补的：获取当前价格（最新收盘价） ----------------
    public BigDecimal getCurrentPrice(String symbol) {
        String url = "https://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData"
                + "?symbol=" + symbol
                + "&scale=240"
                + "&ma=no"
                + "&datalen=1"; // 只取最新一条数据

        try {
            List<Map<String, String>> rawList = restTemplate.getForObject(url, List.class);
            if (rawList == null || rawList.isEmpty()) {
                return BigDecimal.ZERO;
            }

            // 取第一条 = 最新价格
            Map<String, String> latest = rawList.get(0);
            return new BigDecimal(latest.get("close"));

        } catch (Exception e) {
            e.printStackTrace();
        }
        return BigDecimal.ZERO;
    }

    // ---------------- 额外补：获取昨日收盘价（你计算 todayPnl 必须用到！） ----------------
    public BigDecimal getLastClosePrice(String symbol) {
        String url = "https://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData"
                + "?symbol=" + symbol
                + "&scale=240"
                + "&ma=no"
                + "&datalen=2"; // 取最近2条

        try {
            List<Map<String, String>> rawList = restTemplate.getForObject(url, List.class);
            if (rawList == null || rawList.size() < 2) {
                return BigDecimal.ZERO;
            }
            // 第二条 = 昨日收盘价
            return new BigDecimal(rawList.get(1).get("close"));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return BigDecimal.ZERO;
    }
}