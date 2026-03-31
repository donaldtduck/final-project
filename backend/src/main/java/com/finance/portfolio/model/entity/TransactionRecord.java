package com.finance.portfolio.model.entity;

import java.time.LocalDateTime;

public class TransactionRecord {
    private Integer id;
    private String symbol;
    private Double quantity;  // 正数为买入，负数为卖出
    private Double price;     // 交易单价
    private LocalDateTime date;

    public Integer getId() {
        return id;
    }

    public String getSymbol() {
        return symbol;
    }

    public Double getQuantity() {
        return quantity;
    }

    public Double getPrice() {
        return price;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }
}
