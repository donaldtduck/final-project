package com.finance.portfolio.model.entity;

import lombok.Data;
import java.util.Date;

/**
 * 股票代码实体（对应stocks表，仅存symbol）
 */
@Data
public class Stock {
    /** 主键ID */
    private Long id;
    /** 股票代码（核心字段） */
    private String symbol;
    /** 创建时间（自动生成，无需手动赋值） */
    private Date createTime;
}