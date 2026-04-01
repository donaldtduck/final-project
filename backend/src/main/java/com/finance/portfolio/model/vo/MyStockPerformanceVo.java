package com.finance.portfolio.model.vo;

import com.finance.portfolio.model.entity.TransactionRecord;
import lombok.Data;

import java.util.List;

@Data
public class MyStockPerformanceVo {
    private String symbol;
    private List<StockHistoryVo> stockHistoryVoList;
    private List<TransactionRecord> transactionVoList;
}


