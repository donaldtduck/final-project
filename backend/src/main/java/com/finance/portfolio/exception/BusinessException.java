package com.finance.portfolio.exception;

/**
 * 业务异常类，处理输入校验、数据获取等业务场景错误
 */
public class BusinessException extends RuntimeException {
    private int code;       // 错误码
    private String msg;     // 错误信息

    public BusinessException(int code, String msg) {
        super(msg);
        this.code = code;
        this.msg = msg;
    }

    public int getCode() {
        return code;
    }

    public String getMsg() {
        return msg;
    }
}