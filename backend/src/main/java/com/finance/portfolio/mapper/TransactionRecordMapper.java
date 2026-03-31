package com.finance.portfolio.mapper;

import com.finance.portfolio.model.entity.TransactionRecord;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface TransactionRecordMapper {

    // ✅ 完全匹配你的表结构和Model的INSERT
    @Insert("INSERT INTO transaction_record (symbol, quantity, price, date) " +
            "VALUES (#{symbol}, #{quantity}, #{price}, #{date})")
    int insertRecord(TransactionRecord record);

    // 查询某个资产的总持仓量 (通过正负加和)
    @Select("SELECT SUM(quantity) FROM transaction_record WHERE symbol = #{symbol}")
    Double getHoldingQuantity(String symbol);

    // 获取所有交易流水
    @Select("SELECT * FROM transaction_record ORDER BY date DESC")
    List<TransactionRecord> findAll();
}