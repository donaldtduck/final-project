
package com.finance.portfolio.service.impl;

import cn.hutool.core.annotation.Alias;
import com.finance.portfolio.mapper.TransactionRecordMapper;
import com.finance.portfolio.model.dto.AddStockDto;
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
}