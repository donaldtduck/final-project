package com.finance.portfolio.model.entity;

import java.time.LocalDateTime;

public class DepositRecord {
    private Integer id;
    private Double price;
    private LocalDateTime date;

    public Integer getId() {
        return id;
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

    public void setPrice(Double price) {
        this.price = price;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }
}
