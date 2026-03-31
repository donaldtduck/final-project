package com.finance.portfolio.model.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AddStockDto {

    private String symbol;
    private BigDecimal totalPrice;
    private BigDecimal quantity;
    private LocalDateTime date;

}
