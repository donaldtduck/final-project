package com.finance.portfolio.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 移除资产入参DTO
 * quantity：前端传入正数（代表要移除的数量，后端自动转负）
 */
@Data
public class RemoveStockDto {
    @NotBlank(message = "股票代码不能为空")
    private String symbol;        // 股票代码（sh600519/sz000001）

    @NotNull(message = "操作日期不能为空")
    private LocalDateTime date;   // 移除操作日期

    @Positive(message = "移除数量必须为正数")
    private BigDecimal quantity;  // 移除数量（正数，后端转负存入）
}