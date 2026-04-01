package com.finance.portfolio.model.dto;

import com.finance.portfolio.enums.TimeUnitEnum;
import lombok.Data;
import org.springframework.web.bind.annotation.PostMapping;

import java.time.LocalDate;

@Data
public class PerformanceQueryDto {
    private String symbol;
    private Integer slice;
    private TimeUnitEnum unit;

    public static StockQueryDto toStockQuery(PerformanceQueryDto dto) {
        StockQueryDto query = new StockQueryDto();
        query.setSymbol(dto.getSymbol());

        // 1. 自动映射周期 scale
        String scale = switch (dto.getUnit()) {
            case DAY -> "240";
            case WEEK -> "1200";
            case MONTH -> "7200";
            default -> "240";
        };
        query.setScale(scale);

        // 2. 根据 slice（数量） + unit（单位）自动计算 开始/结束日期
        LocalDate endDate = LocalDate.now();  // 结束日期 = 今天
        LocalDate startDate;

        switch (dto.getUnit()) {
            case DAY -> startDate = endDate.minusDays(dto.getSlice());
            case WEEK -> startDate = endDate.minusWeeks(dto.getSlice());
            case MONTH -> startDate = endDate.minusMonths(dto.getSlice());
            default -> startDate = endDate.minusDays(30);
        }

        query.setStartDate(startDate);
        query.setEndDate(endDate);

        return query;
    }
}
