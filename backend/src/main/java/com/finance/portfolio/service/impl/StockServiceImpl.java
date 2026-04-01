
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
import java.util.List;
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
        // 1. 从数据库查出所有持仓记录
        List<TransactionRecord> recordList = transactionRecordMapper.selectAllHoldStock();

        // 2. 遍历 → 取实时价格 → 计算盈亏 → 封装成 StockVo
        return recordList.stream().map(record -> {
            StockVo vo = new StockVo();
            String symbol = record.getSymbol();

            // === 基础字段赋值（严格匹配你的 StockVo）===
            vo.setSymbol(symbol);
            vo.setVolume(record.getQuantity().intValue()); // 持仓数量
            vo.setPurchasePrice(new BigDecimal(record.getPrice())); // 买入单价

            // === 获取实时价格 ===
            BigDecimal currentPrice = sinaStockApiUtil.getCurrentPrice(symbol);
            vo.setCurrentPrice(currentPrice);

            // === 获取昨日收盘价（今日盈亏用）===
            BigDecimal lastClose = sinaStockApiUtil.getLastClosePrice(symbol);

            // === 计算 浮动盈亏 Unrealized P/L ===
            BigDecimal unrealizedPnl = currentPrice
                    .subtract(vo.getPurchasePrice())
                    .multiply(new BigDecimal(vo.getVolume()));
            vo.setUnrealizedPnl(unrealizedPnl);

            // === 计算 今日盈亏 Today P/L ===
            BigDecimal todayPnl = currentPrice
                    .subtract(lastClose)
                    .multiply(new BigDecimal(vo.getVolume()));
            vo.setTodayPnl(todayPnl);

            return vo;
        }).collect(Collectors.toList());
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