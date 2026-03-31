package com.finance.portfolio.util;

import cn.hutool.core.date.DateUtil;
import com.finance.portfolio.model.dto.StockQueryDto;
import com.finance.portfolio.model.vo.StockHistoryVo;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
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

        // 新浪最多一次返回1023条，日线≈4年，足够课程/毕设使用
        String url = "https://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData"
                + "?symbol=" + symbol
                + "&scale=" + scale
                + "&ma=no"
                + "&datalen=1023";

        // 请求原始数据
        List<Map<String, String>> rawList = restTemplate.getForObject(url, List.class);
        if (rawList == null || rawList.isEmpty()) {
            return Collections.emptyList();
        }

        // 转换 + 按日期区间过滤
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
                // 只保留 [start, end] 之间的数据
                .filter(vo -> !vo.getDay().isBefore(start) && !vo.getDay().isAfter(end))
                // 按日期升序（适合画图）
                .sorted(Comparator.comparing(StockHistoryVo::getDay))
                .collect(Collectors.toList());
    }
}