package com.finance.portfolio.mapper;

import com.finance.portfolio.model.entity.Stock;
import org.apache.ibatis.annotations.*;
import java.util.List;

/**
 * 股票代码数据库操作（含增/删/查，带ID）
 */
public interface StockMapper {

    /**
     * 新增股票代码（返回自增ID）
     * @param stock 股票实体（含symbol）
     * @return 影响行数
     */
    @Insert("INSERT INTO stocks (symbol) VALUES (#{symbol})")
    @Options(useGeneratedKeys = true, keyProperty = "id") // 自动回填ID
    int insert(Stock stock);

    /**
     * 批量插入（避免重复）
     * @param symbolList 股票代码列表
     */
    @Insert("<script>" +
            "INSERT IGNORE INTO stocks (symbol) VALUES " +
            "<foreach collection='list' item='symbol' separator=','>" +
            "(#{symbol})" +
            "</foreach>" +
            "</script>")
    int batchInsert(@Param("list") List<String> symbolList);

    /**
     * 根据ID删除股票代码
     * @param id 主键ID
     * @return 影响行数
     */
    @Delete("DELETE FROM stocks WHERE id = #{id}")
    int deleteById(@Param("id") Long id);

    /**
     * 根据symbol删除股票代码
     * @param symbol 股票代码
     * @return 影响行数
     */
    @Delete("DELETE FROM stocks WHERE symbol = #{symbol}")
    int deleteBySymbol(@Param("symbol") String symbol);

    /**
     * 根据ID查询股票
     * @param id 主键ID
     * @return 股票实体
     */
    @Select("SELECT id, symbol, create_time FROM stocks WHERE id = #{id}")
    Stock selectById(@Param("id") Long id);

    /**
     * 查询所有股票（带ID）
     * @return 股票列表
     */
    @Select("SELECT id, symbol, create_time FROM stocks ORDER BY id DESC")
    List<Stock> selectAll();
}