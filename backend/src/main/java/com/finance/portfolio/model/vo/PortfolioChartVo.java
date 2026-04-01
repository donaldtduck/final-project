package com.finance.portfolio.model.vo;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class PortfolioChartVo {

    // 每日总净值（市值线）
    private List<DailyNav> navList;

    // 每日总成本（成本基准线）
    private List<DailyCost> costList;

    // 每日净值
    @Data
    public static class DailyNav {
        private LocalDate date;
        private BigDecimal totalNav; // 美元
    }

    // 每日成本
    @Data
    public static class DailyCost {
        private LocalDate date;
        private BigDecimal totalCost; // 美元
    }
}