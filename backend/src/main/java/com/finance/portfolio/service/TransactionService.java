package com.finance.portfolio.service;

import com.finance.portfolio.model.dto.TransactionRequest;
import com.finance.portfolio.model.entity.TransactionRecord;
import com.finance.portfolio.mapper.TransactionMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class TransactionService {

    @Autowired
    private TransactionMapper transactionMapper;

    public TransactionRecord processTransaction(TransactionRequest request) {
        TransactionRecord record = new TransactionRecord();
        record.setSymbol(request.getSymbol());
        record.setPrice(request.getUnitPrice());
        record.setDate(LocalDateTime.now());

        // 核心换算逻辑
        if (request.getQuantity() != null) {
            // 前端给了股数 -> 存入原值
            record.setQuantity(request.getQuantity());
        } else if (request.getTotalAmount() != null && request.getUnitPrice() != 0) {
            // 前端给了总价 -> 换算成股数 (总价 / 单价)
            double calculatedQuantity = request.getTotalAmount() / request.getUnitPrice();
            record.setQuantity(calculatedQuantity);
        }

        // 执行持久化
        transactionMapper.insert(record);
        return record;
    }
}