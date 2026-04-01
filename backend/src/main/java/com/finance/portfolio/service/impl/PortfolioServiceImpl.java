package com.finance.portfolio.service.impl;

import com.finance.portfolio.mapper.TransactionRecordMapper;
import com.finance.portfolio.model.entity.TransactionRecord;
import com.finance.portfolio.model.vo.PortfolioChartVo;
import com.finance.portfolio.model.vo.PortfolioOverviewVo;
import com.finance.portfolio.model.vo.StockVo;
import com.finance.portfolio.service.PortfolioService;
import com.finance.portfolio.service.StockService;
import com.finance.portfolio.util.SinaStockApiUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PortfolioServiceImpl implements PortfolioService {

    @Autowired
    StockService stockService;
    @Autowired
    TransactionRecordMapper transactionRecordMapper;
    @Autowired
    SinaStockApiUtil sinaStockApiUtil;


    // 汇率
    private static final BigDecimal CNY_TO_USD = new BigDecimal("0.14");
    private static final BigDecimal HKD_TO_USD = new BigDecimal("0.128");
    private static final BigDecimal USD_TO_USD = new BigDecimal("1.0");

    @Override
    public PortfolioOverviewVo getOverview() {
        List<StockVo> stockList = stockService.getStockHoldings();

        PortfolioOverviewVo vo = new PortfolioOverviewVo();

        BigDecimal totalValue = BigDecimal.ZERO;
        BigDecimal totalCost = BigDecimal.ZERO;
        BigDecimal todayPnl = BigDecimal.ZERO;
        Integer totalHoldings = 0;

        // ===================== 多币种汇率定义（2026-04-01 今日实时汇率） =====================

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

    @Override
    public PortfolioChartVo getPortfolioChart() {
        // 1. 获取所有原始交易记录
        List<TransactionRecord> allRecords = transactionRecordMapper.findAll();
        if (allRecords.isEmpty()) {
            return new PortfolioChartVo();
        }

        // 2. 获取所有交易日期（排序）
        Set<LocalDate> tradeDateSet = allRecords.stream()
                .map(r -> r.getDate().toLocalDate())
                .collect(Collectors.toSet());

        List<LocalDate> dateList = new ArrayList<>(tradeDateSet);
        Collections.sort(dateList);

        // 3. 记录每只股票 每天的持仓 & 平均成本
        Map<String, StockPosition> positionMap = new HashMap<>();
        List<PortfolioChartVo.DailyNav> navList = new ArrayList<>();
        List<PortfolioChartVo.DailyCost> costList = new ArrayList<>();

        for (LocalDate date : dateList) {
            // 当天交易
            List<TransactionRecord> dayRecords = allRecords.stream()
                    .filter(r -> r.getDate().toLocalDate().equals(date))
                    .collect(Collectors.toList());

            // 更新持仓
            updatePosition(positionMap, dayRecords);

            // 计算当天总净值、总成本
            BigDecimal totalNav = calculateTotalNetValue(date, positionMap);
            BigDecimal totalCost = calculateTotalCost(positionMap);

            // 装入VO
            PortfolioChartVo.DailyNav nav = new PortfolioChartVo.DailyNav();
            nav.setDate(date);
            nav.setTotalNav(totalNav);
            navList.add(nav);

            PortfolioChartVo.DailyCost cost = new PortfolioChartVo.DailyCost();
            cost.setDate(date);
            cost.setTotalCost(totalCost);
            costList.add(cost);
        }

        PortfolioChartVo vo = new PortfolioChartVo();
        vo.setNavList(navList);
        vo.setCostList(costList);
        return vo;
    }

    // ===================== 更新持仓数量 + 加权平均成本 =====================
    private void updatePosition(Map<String, StockPosition> positionMap,
                                List<TransactionRecord> records) {
        for (TransactionRecord r : records) {
            String symbol = r.getSymbol();
            BigDecimal qty = new BigDecimal(r.getQuantity());
            BigDecimal price = new BigDecimal(r.getPrice());

            StockPosition pos = positionMap.getOrDefault(symbol, new StockPosition());

            if (qty.compareTo(BigDecimal.ZERO) > 0) {
                // 买入 → 重新计算平均成本
                BigDecimal newTotalQty = pos.totalQuantity.add(qty);
                BigDecimal newTotalCost = pos.totalCost.add(qty.multiply(price));

                pos.totalQuantity = newTotalQty;
                pos.totalCost = newTotalCost;
                pos.avgPrice = newTotalCost.divide(newTotalQty, 4, RoundingMode.HALF_UP);
            } else {
                // 卖出 → 只减数量，成本不变
                pos.totalQuantity = pos.totalQuantity.add(qty); // qty 是负的
            }

            if (pos.totalQuantity.compareTo(BigDecimal.ZERO) <= 0) {
                positionMap.remove(symbol);
            } else {
                positionMap.put(symbol, pos);
            }
        }
    }

    // ===================== 计算当天总净值（收盘价 × 数量） =====================
    private BigDecimal calculateTotalNetValue(LocalDate date, Map<String, StockPosition> positionMap) {
        BigDecimal total = BigDecimal.ZERO;

        for (Map.Entry<String, StockPosition> entry : positionMap.entrySet()) {
            String symbol = entry.getKey();
            StockPosition pos = entry.getValue();

            // 获取当天收盘价
            BigDecimal close = sinaStockApiUtil.getClosePriceByDate(symbol, LocalDateTime.of(date, LocalDateTime.MIN.toLocalTime()));
            BigDecimal rate = getRate(symbol);
            BigDecimal usdValue = close.multiply(rate).multiply(pos.totalQuantity);
            total = total.add(usdValue);
        }
        return total.setScale(2, RoundingMode.HALF_UP);
    }

    // ===================== 计算总成本（平均成本 × 数量） =====================
    private BigDecimal calculateTotalCost(Map<String, StockPosition> positionMap) {
        BigDecimal total = BigDecimal.ZERO;

        for (Map.Entry<String, StockPosition> entry : positionMap.entrySet()) {
            String symbol = entry.getKey();
            StockPosition pos = entry.getValue();

            BigDecimal rate = getRate(symbol);
            BigDecimal usdCost = pos.avgPrice.multiply(rate).multiply(pos.totalQuantity);
            total = total.add(usdCost);
        }
        return total.setScale(2, RoundingMode.HALF_UP);
    }

    // ===================== 币种汇率 =====================
    private BigDecimal getRate(String symbol) {
        if (symbol.startsWith("sh") || symbol.startsWith("sz")) return CNY_TO_USD;
        if (symbol.startsWith("hk")) return HKD_TO_USD;
        return USD_TO_USD;
    }

    // 内部类：持仓状态
    private static class StockPosition {
        BigDecimal totalQuantity = BigDecimal.ZERO;
        BigDecimal totalCost = BigDecimal.ZERO;
        BigDecimal avgPrice = BigDecimal.ZERO;
    }
}