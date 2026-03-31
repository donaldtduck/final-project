package com.finance.portfolio.mapper;

import com.finance.portfolio.model.entity.DepositRecord;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface DepositRecordMapper {

    // 插入充值记录
    @Insert("INSERT INTO deposit_record(price, date) VALUES(#{price}, #{date})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertDeposit(DepositRecord record);

    // 查询所有充值历史
    @Select("SELECT * FROM deposit_record ORDER BY date DESC")
    List<DepositRecord> findAllDeposits();

    // 计算总充值金额 (用于分析投入产出比)
    @Select("SELECT SUM(price) FROM deposit_record")
    Double getTotalDepositedAmount();
}
