package com.finance.portfolio.exception;

public enum BusinessErrorEnum {

    // 资产移除相关
    NO_HOLDING(400, "该股票暂无持仓，无法移除"),
    INSUFFICIENT_QUANTITY(400, "持仓数量不足"),

    // 资产添加相关
    INVALID_STOCK(400, "股票代码不存在或无法获取价格"),
    PARAM_ERROR(400, "参数输入错误"),

    // 系统
    SYSTEM_ERROR(500, "系统异常，请稍后重试");

    private final int code;
    private final String message;

    BusinessErrorEnum(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}