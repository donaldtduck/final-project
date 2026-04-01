package com.finance.portfolio.model.dto;

import lombok.Data;

@Data
public class TransactionRequest {
    private String symbol;
    private Double quantity;    // 如果选“股数”，前端传这个
    private Double totalAmount; // 如果选“总额”，前端传这个
    private Double unitPrice;   // 交易时的实时单价
}