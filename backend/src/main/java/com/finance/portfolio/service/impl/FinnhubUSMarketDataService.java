package com.finance.portfolio.service.impl;

import com.finance.portfolio.model.dto.StockQueryDto;
import com.finance.portfolio.model.vo.StockHistoryVo;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.finance.portfolio.service.MarketDataService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service("finnhubUSMarketDataService")
public class FinnhubUSMarketDataService implements MarketDataService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final DateTimeFormatter AV_DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    // ======================== 配置 ========================
    @Value("${finnhub.api.key}")
    private String apiKey;

    // 在这里加你的所有 Twelve Data Key
    private final List<String> API_KEYS = Arrays.asList(
            "4d0d24c7fbbe4cbe86ca345abee319b5",
            "581508536b6a4369a0bf1b446c3b1376",
            "dfef1ca4efa0431c9493787fd95e3af4"
    );

    // 轮询索引
    private int keyIndex = 0;

    // 轮询获取下一个 Key
    private String getNextKey() {
        String key = API_KEYS.get(keyIndex);
        keyIndex = (keyIndex + 1) % API_KEYS.size();
        return key;
    }

// ======================== 历史K线 → Twelve Data 实现 ========================
@Override
    public List<StockHistoryVo> getStockHistory(StockQueryDto dto) {
    String symbol = dto.getSymbol();
    LocalDate start = dto.getStartDate();
    LocalDate end = dto.getEndDate();

    String url = "https://api.twelvedata.com/time_series"
            + "?symbol=" + symbol
            + "&interval=1day"
            + "&start_date=" + start
            + "&end_date=" + end
            + "&apikey=" + getNextKey();

    try {
        String json = restTemplate.getForObject(url, String.class);
        JsonNode root = objectMapper.readTree(json);
        JsonNode values = root.path("values");

        List<StockHistoryVo> list = new ArrayList<>();
        for (JsonNode node : values) {
            LocalDate day = LocalDate.parse(node.get("datetime").asText());
            BigDecimal open = new BigDecimal(node.get("open").asText());
            BigDecimal high = new BigDecimal(node.get("high").asText());
            BigDecimal low = new BigDecimal(node.get("low").asText());
            BigDecimal close = new BigDecimal(node.get("close").asText());
            Long volume = 0L; // Twelve 免费版不返回成交量

            list.add(new StockHistoryVo(day, open, high, low, close, volume));
        }

        Collections.reverse(list);

        return list;
    } catch (Exception e) {
        e.printStackTrace();
        return new ArrayList<>();
    }
}

    // ======================== 按日期取收盘价 → Twelve Data 稳定版 ========================
    @Override
    public BigDecimal getClosePriceByDate(String symbol, LocalDateTime dateTime) {
        LocalDate target = dateTime.toLocalDate();

        // 扩大范围，避免周末/休市拿不到
        LocalDate start = target.minusDays(5);
        LocalDate end = target;

        List<StockHistoryVo> history = getStockHistory(
                new StockQueryDto(symbol, start, end, "240")
        );

        // 取 <= target 的最近一天收盘价
        return history.stream()
                .filter(vo -> !vo.getDay().isAfter(target))
                .sorted((a, b) -> b.getDay().compareTo(a.getDay()))
                .findFirst()
                .map(StockHistoryVo::getClose)
                .orElse(BigDecimal.ZERO);
    }

    // 工具：打印 API 返回的原始 JSON（关键！）
    private void debugJson(String title, String json) {
        System.out.println("=====================================");
        System.out.println("DEBUG: " + title);
        System.out.println(json);  // 直接打印返回内容
        System.out.println("=====================================");
    }

    // ======================== 当前价格 → 保留 FINNHUB ========================
    @Override
    public BigDecimal getCurrentPrice(String symbol) {
        try {
            String url = "https://finnhub.io/api/v1/quote?symbol=" + symbol + "&token=" + apiKey;
            String json = restTemplate.getForObject(url, String.class);
            JsonNode node = objectMapper.readTree(json);
            return new BigDecimal(node.path("c").asText());
        } catch (Exception e) {
            return BigDecimal.ZERO;
        }
    }

    // ======================== 昨日收盘价 → 保留 FINNHUB ========================
    @Override
    public BigDecimal getLastClosePrice(String symbol) {
        try {
            String url = "https://finnhub.io/api/v1/quote?symbol=" + symbol + "&token=" + apiKey;
            String json = restTemplate.getForObject(url, String.class);
            JsonNode node = objectMapper.readTree(json);
            return new BigDecimal(node.path("pc").asText());
        } catch (Exception e) {
            return getCurrentPrice(symbol);
        }
    }
}