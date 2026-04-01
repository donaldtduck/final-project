package com.finance.portfolio.model.vo;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class StockVo {

    /**
     * 股票代码 (如 AAPL, sh600000)
     * 对应 UI 左上角的 symbol
     */
    private String symbol;

    /**
     * 成交量/持仓数量
     * 对应 UI Volume
     */
    private Integer volume;

    /**
     * 买入单价 (成本价)
     * 对应 UI Purchase Price
     */
    private BigDecimal purchasePrice;

    /**
     * 当前市场价格
     * 对应 UI Current Price
     */
    private BigDecimal currentPrice;

    /**
     * 浮动盈亏 (未实现盈亏)
     * 对应 UI Unrealized P/L
     */
    private BigDecimal unrealizedPnl;

    /**
     * 今日盈亏
     * 对应 UI Today P/L
     */
    private BigDecimal todayPnl;

}