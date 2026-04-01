
package com.finance.portfolio.model.vo;

import lombok.Data;

@Data
public class ResultVo<T> {
    private int code;
    private String msg;
    private T data;

    // 成功（带数据）
    public static <T> ResultVo<T> success(T data) {
        ResultVo<T> result = new ResultVo<>();
        result.setCode(200);
        result.setMsg("操作成功");
        result.setData(data);
        return result;
    }

    // 成功（带消息，无数据）
    public static <T> ResultVo<T> success(String msg) {
        ResultVo<T> result = new ResultVo<>();
        result.setCode(200);
        result.setMsg(msg);
        result.setData(null);
        return result;
    }

    // 成功（无数据）
    public static <T> ResultVo<T> success() {
        return success(null);
    }

    //  修复1：增加 3个参数的 error 方法（包含 data）
    public static <T> ResultVo<T> error(int code, String msg, T data) {
        ResultVo<T> result = new ResultVo<>();
        result.setCode(code);
        result.setMsg(msg);
        result.setData(data);
        return result;
    }

    // 原有 2个参数的 error 方法（保持不变）
    public static <T> ResultVo<T> error(int code, String msg) {
        ResultVo<T> result = new ResultVo<>();
        result.setCode(code);
        result.setMsg(msg);
        result.setData(null);
        return result;
    }
}