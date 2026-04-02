package com.finance.portfolio.model.vo;

import java.math.BigDecimal;
import lombok.Data;

/**
 * 股票快照VO：封装单只股票的核心行情信息
 */
@Data
public class StockSnapshotVo {
    /** 股票代码（如sh600000、AAPL） */
    private String symbol;
    /** 当前价格 */
    private BigDecimal currentPrice;
    /** 涨跌幅（百分比，保留两位小数） */
    private BigDecimal priceChangeRate;
}