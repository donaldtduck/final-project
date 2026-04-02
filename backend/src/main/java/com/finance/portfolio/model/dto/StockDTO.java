package com.finance.portfolio.model.dto;

import lombok.Data;

/**
 * 股票代码操作DTO（增/删）
 */
@Data
public class StockDto {
    /** 主键ID（删除/查询用） */
    private Long id;
    /** 股票代码（新增/删除用） */
    private String symbol;
}
