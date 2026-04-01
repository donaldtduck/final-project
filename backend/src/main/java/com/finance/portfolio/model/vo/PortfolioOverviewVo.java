package com.finance.portfolio.model.vo;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PortfolioOverviewVo {

    /**
     * 总资产总价值 (Total Value)
     * 计算公式：所有股票 (当前价 * 持仓量) 之和
     */
    private BigDecimal totalValue;

    /**
     * 总持仓成本 (Total Cost)
     * 计算公式：所有股票 (买入价 * 持仓量) 之和
     */
    private BigDecimal totalCost;

    /**
     * 浮动盈亏 (Unrealized P/L)
     * 计算公式：总资产 - 总成本 (totalValue - totalCost)
     * 颜色：盈利为绿，亏损为红
     */
    private BigDecimal unrealizedPnl;

    /**
     * 已实现盈亏 (Realized P/L)
     * 目前业务逻辑：卖出股票时记录的盈亏总和（未实现，预留字段）
     */
    private BigDecimal realizedPnl;

    /**
     * 累计收益率 (Return)
     * 计算公式：浮动盈亏 ÷ 总成本 × 100%
     */
    private BigDecimal returnRate;

    /**
     * 今日盈亏 (Today P/L)
     * 计算公式：∑[(当前价 - 昨日收盘价) * 持仓量]
     */
    private BigDecimal todayPnl;

    /**
     * 今日涨跌幅 (Today Change)
     * 计算公式：今日盈亏 ÷ 昨日总市值 × 100%
     */
    private BigDecimal todayChange;

    /**
     * 持仓数量 (Holdings)
     * 计算公式：所有股票持仓数量的总和
     */
    private Integer totalHoldings;

    public PortfolioOverviewVo() {
        // 初始化，避免前端出现 null 报错
        this.totalValue = BigDecimal.ZERO;
        this.totalCost = BigDecimal.ZERO;
        this.unrealizedPnl = BigDecimal.ZERO;
        this.realizedPnl = BigDecimal.ZERO;
        this.returnRate = BigDecimal.ZERO;
        this.todayPnl = BigDecimal.ZERO;
        this.todayChange = BigDecimal.ZERO;
        this.totalHoldings = 0;
    }
}