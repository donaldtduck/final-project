package com.finance.portfolio.service.impl;

import cn.hutool.core.annotation.Alias;
import com.finance.portfolio.exception.BusinessException;
import com.finance.portfolio.mapper.TransactionRecordMapper;
import com.finance.portfolio.model.dto.AddStockDto;
import com.finance.portfolio.model.dto.RemoveStockDto;
import com.finance.portfolio.model.entity.TransactionRecord;
import com.finance.portfolio.model.vo.StockVo;
import com.finance.portfolio.service.StockService;
import com.finance.portfolio.util.SinaStockApiUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class StockServiceImpl implements StockService {

    @Autowired
    SinaStockApiUtil sinaStockApiUtil;
    @Autowired
    TransactionRecordMapper transactionRecordMapper;

    @Override
    public void addStock(AddStockDto addStockDto) {
        BigDecimal closePriceByDate = sinaStockApiUtil.getClosePriceByDate(addStockDto.getSymbol(), addStockDto.getDate());

        TransactionRecord transactionRecord = new TransactionRecord();
        transactionRecord.setSymbol(addStockDto.getSymbol());
        transactionRecord.setDate(addStockDto.getDate());
        // optional field

        if (addStockDto.getQuantity() == null) {
            transactionRecord.setQuantity(addStockDto.getTotalPrice().doubleValue() / closePriceByDate.doubleValue());
        } else {
            transactionRecord.setQuantity(addStockDto.getQuantity().doubleValue());
        }
        transactionRecord.setPrice(closePriceByDate.doubleValue());

        transactionRecordMapper.insertRecord(transactionRecord);
    }

    @Override
    public List<StockVo> getStockListWithPnl() {
        // 1. 获取【所有原始交易记录】（必须用原始记录计算成本）
        List<TransactionRecord> allRecords = transactionRecordMapper.findAll();

        // 2. 按股票代码分组
        Map<String, List<TransactionRecord>> groupBySymbol = allRecords.stream()
                .collect(Collectors.groupingBy(TransactionRecord::getSymbol));

        // 3. 逐只股票计算：持仓数量、加权平均成本价
        return groupBySymbol.entrySet().stream()
                .map(entry -> {
                    String symbol = entry.getKey();
                    List<TransactionRecord> records = entry.getValue();

                    // === 核心计算变量 ===
                    BigDecimal totalBuyQuantity = BigDecimal.ZERO;  // 总买入股数
                    BigDecimal totalBuyCost = BigDecimal.ZERO;      // 总买入成本
                    BigDecimal totalSellQuantity = BigDecimal.ZERO; // 总卖出股数

                    for (TransactionRecord record : records) {
                        BigDecimal qty = new BigDecimal(record.getQuantity());
                        BigDecimal price = new BigDecimal(record.getPrice());

                        if (qty.compareTo(BigDecimal.ZERO) > 0) {
                            // 买入：累计数量 + 成本
                            totalBuyQuantity = totalBuyQuantity.add(qty);
                            totalBuyCost = totalBuyCost.add(qty.multiply(price));
                        } else {
                            // 卖出：只累计卖出数量，不计算成本
                            totalSellQuantity = totalSellQuantity.add(qty.abs());
                        }
                    }

                    // 最终持仓数量
                    BigDecimal finalQuantity = totalBuyQuantity.subtract(totalSellQuantity);

                    // 无持仓 → 跳过
                    if (finalQuantity.compareTo(BigDecimal.ZERO) <= 0) {
                        return null;
                    }

                    // === 加权平均成本价（真正正确的 PurchasePrice）===
                    BigDecimal avgPrice = totalBuyCost.divide(totalBuyQuantity, 4, RoundingMode.HALF_UP);

                    // === 获取市场价格 ===
                    BigDecimal currentPrice = sinaStockApiUtil.getCurrentPrice(symbol);
                    BigDecimal lastClose = sinaStockApiUtil.getLastClosePrice(symbol);

                    // === 封装 VO ===
                    StockVo vo = new StockVo();
                    vo.setSymbol(symbol);
                    vo.setVolume(finalQuantity.intValue());
                    vo.setPurchasePrice(avgPrice); // ✅ 正确：加权平均成本
                    vo.setCurrentPrice(currentPrice);

                    // === 浮动盈亏 = (当前价 - 平均成本) × 持仓数量 ===
                    BigDecimal unrealizedPnl = currentPrice
                            .subtract(avgPrice)
                            .multiply(finalQuantity);
                    vo.setUnrealizedPnl(unrealizedPnl);

                    // === 今日盈亏 = (当前价 - 昨收价) × 持仓数量 ===
                    BigDecimal todayPnl = currentPrice
                            .subtract(lastClose)
                            .multiply(finalQuantity);
                    vo.setTodayPnl(todayPnl);

                    return vo;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }



    @Override
    public List<StockVo> getStockHoldings() {
        // 1. 获取所有交易流水（不能用分组后的，必须用原始流水算平均成本）
        List<TransactionRecord> allRecords = transactionRecordMapper.findAll();

        // 2. 按股票代码分组 → 计算每只股票的：总数量、总成本、平均成本
        Map<String, List<TransactionRecord>> groupBySymbol = allRecords.stream()
                .collect(Collectors.groupingBy(TransactionRecord::getSymbol));

        return groupBySymbol.entrySet().stream()
                .map(entry -> {
                    String symbol = entry.getKey();
                    List<TransactionRecord> records = entry.getValue();

                    // === 核心：计算总持仓数量、总投入成本 ===
                    BigDecimal totalQuantity = BigDecimal.ZERO;
                    BigDecimal totalCost = BigDecimal.ZERO;

                    for (TransactionRecord record : records) {
                        BigDecimal qty = new BigDecimal(record.getQuantity());
                        BigDecimal price = new BigDecimal(record.getPrice());

                        totalQuantity = totalQuantity.add(qty);
                        totalCost = totalCost.add(qty.multiply(price));
                    }

                    // 过滤空仓
                    if (totalQuantity.compareTo(BigDecimal.ZERO) <= 0) {
                        return null;
                    }

                    // === 计算 平均成本价（真正正确的 PurchasePrice）===
                    BigDecimal avgPrice = totalCost.divide(totalQuantity, 4, RoundingMode.HALF_UP);

                    // === 当前价格 & 昨日收盘价 ===
                    BigDecimal currentPrice = sinaStockApiUtil.getCurrentPrice(symbol);
                    BigDecimal lastClose = sinaStockApiUtil.getLastClosePrice(symbol);

                    // === 组装 VO ===
                    StockVo vo = new StockVo();
                    vo.setSymbol(symbol);
                    vo.setVolume(totalQuantity.intValue());
                    vo.setPurchasePrice(avgPrice); // ✅ 正确：平均成本
                    vo.setCurrentPrice(currentPrice);

                    // === 浮动盈亏 = (当前价 - 平均成本) * 数量 ===
                    BigDecimal unrealizedPnl = currentPrice
                            .subtract(avgPrice)
                            .multiply(totalQuantity);
                    vo.setUnrealizedPnl(unrealizedPnl);

                    // === 今日盈亏 = (当前价 - 昨收价) * 数量 ===
                    BigDecimal todayPnl = currentPrice
                            .subtract(lastClose)
                            .multiply(totalQuantity);
                    vo.setTodayPnl(todayPnl);

                    return vo;
                })
                .filter(vo -> vo != null)
                .collect(Collectors.toList());
    }

    // ====== 新增：用户故事4 移除资产核心逻辑 ======
    @Override
    public void removeStock(RemoveStockDto removeStockDto) {
        // 1. 获取当前股票的持仓总数量（从交易记录汇总）
        Double holdingQuantity = transactionRecordMapper.getHoldingQuantity(removeStockDto.getSymbol());
        // 校验：股票无持仓记录
        if (holdingQuantity == null || holdingQuantity <= 0) {
            throw new BusinessException(400, "该股票暂无持仓，无法移除");
        }
        // 2. 核心校验：持仓数量 ≥ 移除数量（避免超量移除）
        BigDecimal removeQty = removeStockDto.getQuantity();
        if (removeQty.doubleValue() > holdingQuantity) {
            throw new BusinessException(400, "持仓数量不足，当前持仓：" + holdingQuantity + "股，尝试移除：" + removeQty + "股");
        }
        // 3. 获取操作日期的股票收盘价（与添加资产逻辑一致，保证价格准确性）
        BigDecimal closePriceByDate = sinaStockApiUtil.getClosePriceByDate(removeStockDto.getSymbol(), removeStockDto.getDate());
        if (closePriceByDate.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException(400, "获取股票价格失败，请检查代码或日期是否正确");
        }
        // 4. 构建交易记录：移除数量转为【负数】存入（代表卖出/移除）
        TransactionRecord transactionRecord = new TransactionRecord();
        transactionRecord.setSymbol(removeStockDto.getSymbol());
        transactionRecord.setDate(removeStockDto.getDate());
        transactionRecord.setQuantity(-removeQty.doubleValue()); // 关键：转负数
        transactionRecord.setPrice(closePriceByDate.doubleValue());
        // 5. 存入数据库
        transactionRecordMapper.insertRecord(transactionRecord);
    }
}