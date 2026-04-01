package com.finance.portfolio.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StockQueryDto {
    // 股票代码，如 sh600000、sz000001
    private String symbol;

    // 开始日期
    private LocalDate startDate;

    // 结束日期
    private LocalDate endDate;

    // 周期：240=日线，60=60分钟，5=5分钟，w=周，m=月
    private String scale = "240";


}
