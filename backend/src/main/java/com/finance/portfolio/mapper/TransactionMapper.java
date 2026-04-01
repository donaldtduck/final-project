package com.finance.portfolio.mapper;

import com.finance.portfolio.model.entity.TransactionRecord;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;

@Mapper
public interface TransactionMapper {

    @Insert("INSERT INTO transaction_records (symbol, quantity, price, date) " +
            "VALUES (#{symbol}, #{quantity}, #{price}, #{date})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(TransactionRecord record);
}