package com.finance.portfolio.model.dto;

import lombok.Data;
import java.util.List;

@Data
public class AIChatRequest {
    private List<PortfolioHolding> portfolio;
    private PortfolioSummary summary;
    private String userMessage;

    @Data
    public static class PortfolioHolding {
        private String symbol;
        private double volume;
        private double currentPrice;
        private double purchasePrice;
        private double unrealizedPnl;
        private double todayPnl;
    }

    @Data
    public static class PortfolioSummary {
        private double totalValue;
        private double totalCost;
        private double unrealizedPL;
        private double todayPL;
        private int holdings;
    }
}