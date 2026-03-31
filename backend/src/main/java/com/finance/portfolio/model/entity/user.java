package com.finance.portfolio.model.entity;

public class user {
    private String username;
    private Double balance;   // 账户可用余额

    public String getUsername() {
        return username;
    }

    public Double getBalance() {
        return balance;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }
}
