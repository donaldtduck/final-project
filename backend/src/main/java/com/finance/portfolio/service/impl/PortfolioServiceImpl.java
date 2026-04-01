package com.finance.portfolio.service.impl;

import com.finance.portfolio.model.vo.PortfolioOverviewVo;
import com.finance.portfolio.model.vo.StockVo;
import com.finance.portfolio.service.PortfolioService;
import com.finance.portfolio.service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class PortfolioServiceImpl implements PortfolioService {

    @Autowired
    StockService stockService;

    @Override
    public PortfolioOverviewVo getOverview() {
        List<StockVo> stockList = stockService.getStockHoldings();

        PortfolioOverviewVo vo = new PortfolioOverviewVo();

        BigDecimal totalValue = BigDecimal.ZERO;
        BigDecimal totalCost = BigDecimal.ZERO;
        BigDecimal todayPnl = BigDecimal.ZERO;
        Integer totalHoldings = 0;

        // ===================== 多币种汇率定义（2026-04-01 今日实时汇率） =====================
        final BigDecimal USD_TO_USD = new BigDecimal("1.0");        // 美元
        final BigDecimal CNY_TO_USD = new BigDecimal("0.14");       // 人民币 → 美元
        final BigDecimal HKD_TO_USD = new BigDecimal("0.128");      // 港币 → 美元

        for (StockVo stock : stockList) {
            String symbol = stock.getSymbol();
            BigDecimal current = stock.getCurrentPrice();
            BigDecimal cost = stock.getPurchasePrice();
            BigDecimal dayPnl = stock.getTodayPnl();
            Integer volume = stock.getVolume();
            BigDecimal vol = new BigDecimal(volume);

            // ===================== 根据股票代码自动识别币种 =====================
            BigDecimal rate;
            if (symbol.startsWith("sh") || symbol.startsWith("sz")) {
                // A 股 → 人民币
                rate = CNY_TO_USD;
            } else if (symbol.startsWith("hk")) {
                // 港股 → 港币
                rate = HKD_TO_USD;
            } else {
                // 美股 → 美元
                rate = USD_TO_USD;
            }

            // ===================== 统一换算成美元 =====================
            BigDecimal currentUsd = current.multiply(rate).setScale(4, RoundingMode.HALF_UP);
            BigDecimal costUsd = cost.multiply(rate).setScale(4, RoundingMode.HALF_UP);
            BigDecimal dayPnlUsd = dayPnl.multiply(rate).setScale(4, RoundingMode.HALF_UP);

            // ===================== 累加（全部是美元） =====================
            totalValue = totalValue.add(currentUsd.multiply(vol));
            totalCost = totalCost.add(costUsd.multiply(vol));
            todayPnl = todayPnl.add(dayPnlUsd);
            totalHoldings += volume;
        }

        // ===================== 计算组合表现（全部基于美元，正确！） =====================
        BigDecimal unrealizedPnl = totalValue.subtract(totalCost);

        BigDecimal returnRate = BigDecimal.ZERO;
        if (totalCost.compareTo(BigDecimal.ZERO) != 0) {
            returnRate = unrealizedPnl.divide(totalCost, 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"));
        }

        BigDecimal yesterdayTotal = totalValue.subtract(todayPnl);
        BigDecimal todayChange = BigDecimal.ZERO;
        if (yesterdayTotal.compareTo(BigDecimal.ZERO) != 0) {
            todayChange = todayPnl.divide(yesterdayTotal, 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"));
        }

        // ===================== 最终所有值都是美元 =====================
        vo.setTotalValue(totalValue.setScale(2, RoundingMode.HALF_UP));
        vo.setTotalCost(totalCost.setScale(2, RoundingMode.HALF_UP));
        vo.setUnrealizedPnl(unrealizedPnl.setScale(2, RoundingMode.HALF_UP));
        vo.setRealizedPnl(BigDecimal.ZERO);
        vo.setReturnRate(returnRate.setScale(2, RoundingMode.HALF_UP));
        vo.setTodayPnl(todayPnl.setScale(2, RoundingMode.HALF_UP));
        vo.setTodayChange(todayChange.setScale(2, RoundingMode.HALF_UP));
        vo.setTotalHoldings(totalHoldings);

        return vo;
    }
}