//package com.finance.portfolio.service.impl;
//
//import cn.hutool.core.annotation.Alias;
//import com.finance.portfolio.mapper.TransactionRecordMapper;
//import com.finance.portfolio.model.dto.AddStockDto;
//import com.finance.portfolio.model.entity.TransactionRecord;
//import com.finance.portfolio.service.StockService;
//import com.finance.portfolio.util.SinaStockApiUtil;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.math.BigDecimal;
//
//@Service
//public class StockServiceImpl implements StockService {
//
//    @Autowired
//    SinaStockApiUtil sinaStockApiUtil;
//    @Autowired
//    TransactionRecordMapper transactionRecordMapper;
//
//    @Override
//    public void addStock(AddStockDto addStockDto) {
//        BigDecimal closePriceByDate = sinaStockApiUtil.getClosePriceByDate(addStockDto.getSymbol(), addStockDto.getDate());
//
//        TransactionRecord transactionRecord = new TransactionRecord();
//        transactionRecord.setSymbol(addStockDto.getSymbol());
//        transactionRecord.setDate(addStockDto.getDate());
//        // optional field
//        if (addStockDto.getQuantity() == null) {
//            transactionRecord.setQuantity(addStockDto.getTotalPrice().doubleValue() / closePriceByDate.doubleValue());
//        } else {
//            transactionRecord.setQuantity(addStockDto.getQuantity().doubleValue());
//        }
//        transactionRecord.setPrice(closePriceByDate.doubleValue());
//
//        transactionRecordMapper.insertRecord(transactionRecord);
//    }
//}



package com.finance.portfolio.service.impl;

import com.finance.portfolio.exception.BusinessException;
import com.finance.portfolio.mapper.TransactionRecordMapper;
import com.finance.portfolio.model.dto.AddStockDto;
import com.finance.portfolio.model.entity.Asset;
import com.finance.portfolio.model.entity.TransactionRecord;
import com.finance.portfolio.service.StockService;
import com.finance.portfolio.util.SinaStockApiUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class StockServiceImpl implements StockService {
    @Autowired
    SinaStockApiUtil sinaStockApiUtil;

    @Autowired
    TransactionRecordMapper transactionRecordMapper;

    /**
     * 实现添加资产逻辑，满足AC3.1、AC3.2
     */
    @Override
    public void addStock(AddStockDto addStockDto) {
        // 1. 基础参数校验（补充DTO注解外的业务校验）
        validateAddStockParams(addStockDto);

        // 2. 获取指定日期的收盘价（复用现有工具类方法）
        BigDecimal closePriceByDate = sinaStockApiUtil.getClosePriceByDate(addStockDto.getSymbol(), addStockDto.getDate());
        if (closePriceByDate.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException(400, "获取股票价格失败，请检查代码或日期是否正确");
        }

        // 3. 构建交易记录
        TransactionRecord transactionRecord = new TransactionRecord();
        transactionRecord.setSymbol(addStockDto.getSymbol());
        transactionRecord.setDate(addStockDto.getDate());

        // 4. 处理数量逻辑（quantity和totalPrice二选一，优先quantity）
        if (addStockDto.getQuantity() == null) {
            if (addStockDto.getTotalPrice() == null || addStockDto.getTotalPrice().compareTo(BigDecimal.ZERO) <= 0) {
                throw new BusinessException(400, "总金额必须为正数");
            }
            // 总金额 / 收盘价 = 数量（保留2位小数）
            BigDecimal quantity = addStockDto.getTotalPrice().divide(closePriceByDate, 2, BigDecimal.ROUND_HALF_UP);
            transactionRecord.setQuantity(quantity.doubleValue());
        } else {
            transactionRecord.setQuantity(addStockDto.getQuantity().doubleValue());
        }

        transactionRecord.setPrice(closePriceByDate.doubleValue());

        // 5. 存入数据库（满足T3.1）
        int insertResult = transactionRecordMapper.insertRecord(transactionRecord);
        if (insertResult != 1) {
            throw new BusinessException(500, "添加资产失败，请重试");
        }
    }

    /**
     * 实现获取所有可用股票逻辑（满足T3.2）
     */
    @Override
    public List<Asset> getAllAvailableStocks() {
        // 常用股票列表（可扩展为从数据库配置，当前适配前端快速开发）
        List<String> commonSymbols = List.of(
                "sh600519", "sh601318", "sz000858",  // 贵州茅台、中国平安、五粮液
                "sz000001", "sh600036", "sz002594",  // 平安银行、招商银行、比亚迪
                "sh601899", "sz000651", "sh600000"   // 紫金矿业、格力电器、浦发银行
        );

        List<Asset> availableStocks = new ArrayList<>();
        for (String symbol : commonSymbols) {
            // 调用新浪API获取股票名称（无需存储，实时获取）
            String stockName = getStockNameBySymbol(symbol);
            Asset asset = new Asset();
            asset.setSymbol(symbol);
            asset.setName(stockName);
            asset.setType("STOCK");  // 默认为股票类型
            availableStocks.add(asset);
        }
        return availableStocks;
    }

    /**
     * 辅助方法：通过股票代码获取名称
     */
    private String getStockNameBySymbol(String symbol) {
        try {
            // 复用新浪API工具类逻辑，解析股票名称
            String url = "http://hq.sinajs.cn/list=" + symbol;
            String rawData = sinaStockApiUtil.getRestTemplate().getForObject(url, String.class);
            if (rawData != null && rawData.contains("\"")) {
                String content = rawData.substring(rawData.indexOf("\"") + 1, rawData.lastIndexOf("\""));
                String[] parts = content.split(",");
                if (parts.length > 0) {
                    return parts[0];
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return symbol;  // 获取失败时返回代码
    }

    /**
     * 辅助方法：添加资产参数校验（满足AC3.2）
     */
    private void validateAddStockParams(AddStockDto addStockDto) {
        // 股票代码校验
        if (addStockDto.getSymbol() == null || addStockDto.getSymbol().trim().isEmpty()) {
            throw new BusinessException(400, "股票代码不能为空");
        }
        // 日期校验
        if (addStockDto.getDate() == null) {
            throw new BusinessException(400, "购买日期不能为空");
        }
        // 数量和总金额二选一校验
        if (addStockDto.getQuantity() == null && addStockDto.getTotalPrice() == null) {
            throw new BusinessException(400, "持仓数量和总金额必须填写一项");
        }
        // 数量为正数校验（DTO注解已校验，此处双重保障）
        if (addStockDto.getQuantity() != null && addStockDto.getQuantity().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException(400, "持仓数量必须为正数");
        }
        // 总金额为正数校验
        if (addStockDto.getTotalPrice() != null && addStockDto.getTotalPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException(400, "总金额必须为正数");
        }
    }
}
