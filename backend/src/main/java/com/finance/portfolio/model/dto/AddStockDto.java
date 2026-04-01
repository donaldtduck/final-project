//package com.finance.portfolio.model.dto;
//
//import lombok.Data;
//
//import java.math.BigDecimal;
//import java.time.LocalDateTime;
//
//@Data
//public class AddStockDto {
//
//    private String symbol;
//    private BigDecimal totalPrice;
//    private BigDecimal quantity;
//    private LocalDateTime date;
//
//}

package com.finance.portfolio.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 添加资产入参DTO，包含完整输入校验
 */
@Data
public class AddStockDto {
    @NotBlank(message = "股票代码不能为空（格式：sh600519 或 sz000001）")
    private String symbol;          // 股票代码（必填）

    private BigDecimal totalPrice;  // 总金额（与quantity二选一）

    @Positive(message = "持仓数量必须为正数")
    private BigDecimal quantity;    // 持仓数量（必填，正数）

    @NotNull(message = "购买日期不能为空")
    private LocalDateTime date;     // 购买日期（必填）
}
