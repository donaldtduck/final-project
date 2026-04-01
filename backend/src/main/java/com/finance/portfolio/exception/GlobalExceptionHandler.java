package com.finance.portfolio.exception;

import com.finance.portfolio.model.vo.ResultVo;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * 全局异常处理器，统一捕获并返回错误信息，适配前端错误提示
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 处理自定义业务异常（输入校验、业务逻辑错误）
     */
    @ExceptionHandler(BusinessException.class)
    public ResultVo<Void> handleBusinessException(BusinessException e) {
        return ResultVo.error(e.getCode(), e.getMsg());
    }

    /**
     * 处理DTO参数校验异常（@Valid注解触发）
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResultVo<Map<String, String>> handleValidException(MethodArgumentNotValidException e) {
        Map<String, String> errorMap = new HashMap<>();
        // 提取字段级错误信息
        e.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMsg = error.getDefaultMessage();
            errorMap.put(fieldName, errorMsg);
        });
        return ResultVo.error(400, "参数校验失败", errorMap);
    }

    /**
     * 处理其他参数校验异常
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResultVo<Map<String, String>> handleConstraintViolationException(ConstraintViolationException e) {
        Map<String, String> errorMap = new HashMap<>();
        Set<ConstraintViolation<?>> violations = e.getConstraintViolations();
        for (ConstraintViolation<?> violation : violations) {
            String fieldName = violation.getPropertyPath().toString();
            String errorMsg = violation.getMessage();
            errorMap.put(fieldName, errorMsg);
        }
        return ResultVo.error(400, "参数校验失败", errorMap);
    }

    /**
     * 处理系统异常
     */
    @ExceptionHandler(Exception.class)
    public ResultVo<Void> handleException(Exception e) {
        // 生产环境可替换为日志输出，避免暴露敏感信息
        e.printStackTrace();
        return ResultVo.error(500, "系统异常，请联系管理员");
    }
}