package com.finance.portfolio.model.entity;

public class Asset {
    private String symbol;    // 股票/债券代码
    private String name;      // 名称
    private String type;      // 类型: STOCK, BOND, etc.
    private Double avgPrice;  // 平均成本价

    public String getSymbol() {
        return symbol;
    }

    public String getName() {
        return name;
    }

    public String getType() {
        return type;
    }

    public Double getAvgPrice() {
        return avgPrice;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setAvgPrice(Double avgPrice) {
        this.avgPrice = avgPrice;
    }
}
