package com.finance.portfolio.service.impl;

import cn.hutool.core.annotation.Alias;
import com.finance.portfolio.mapper.TransactionRecordMapper;
import com.finance.portfolio.model.dto.AddStockDto;
import com.finance.portfolio.model.entity.TransactionRecord;
import com.finance.portfolio.service.StockService;
import com.finance.portfolio.util.SinaStockApiUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

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
}
