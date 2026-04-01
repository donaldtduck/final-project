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


    /**
     * 查询 所有有持仓的股票（持仓数量 > 0）
     * 按股票分组，汇总持仓数量 + 取最新一次的买入价作为成本价
     */
    @Select("SELECT " +
            "symbol, " +
            "SUM(quantity) AS quantity, " +
            // 取最新一笔交易的价格作为持仓成本价
            "(SELECT price FROM transaction_record t2 " +
            " WHERE t2.symbol = t1.symbol ORDER BY date DESC LIMIT 1) AS price, " +
            // 取最新日期（非必须，兼容实体类）
            "MAX(date) AS date " +
            "FROM transaction_record t1 " +
            "GROUP BY symbol " +
            "HAVING SUM(quantity) > 0 " +
            "ORDER BY symbol")
    List<TransactionRecord> selectAllHoldStock();
}