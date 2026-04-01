package com.finance.portfolio.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 时间单位枚举
 * 前端可传：DAY / DAYS / 1  都能自动映射
 */
@Getter
@RequiredArgsConstructor
public enum TimeUnitEnum {

    DAY("day", 1),
    WEEK("week", 7),
    MONTH("month", 30);

    // 中文描述
    private final String desc;

    // 数值（可用于计算）
    private final Integer code;

    /**
     * 【关键】JSON 序列化时输出的值
     * 前端看到的是：DAY / WEEK / MONTH
     */
    @JsonValue
    public String getCodeStr() {
        return this.name();
    }

}