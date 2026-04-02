
package com.finance.portfolio.service;

import com.finance.portfolio.model.dto.AddStockDto;
import com.finance.portfolio.model.dto.PerformanceQueryDto;
import com.finance.portfolio.model.dto.RemoveStockDto;
import com.finance.portfolio.model.dto.StockDto;
import com.finance.portfolio.model.entity.Stock;
import com.finance.portfolio.model.entity.TransactionRecord;
import com.finance.portfolio.model.vo.MyStockPerformanceVo;
import com.finance.portfolio.model.vo.StockSnapshotVo;
import com.finance.portfolio.model.vo.StockVo;

import java.util.List;

public interface StockService {

    public void addStock(AddStockDto addStockDto);

    List<StockVo> getStockListWithPnl();


    List<StockVo> getStockHoldings();

    // 新增：用户故事4：移除资产
    void removeStock(RemoveStockDto removeStockDto);

    public MyStockPerformanceVo getMyStockPerformance(PerformanceQueryDto performanceQueryDto);

    /**
     * 获取所有持仓/关注股票的快照信息（包含涨跌幅计算）
     * @return 股票快照列表
     */
    List<StockSnapshotVo> getAllStockSnapshots();

    // 新增增/删/查方法（带ID）
    /**
     * 新增单只股票代码（返回ID）
     */
    Long addStockSymbol(StockDto stockDto);

    /**
     * 根据ID删除股票代码
     */
    boolean deleteStockById(Long id);

    /**
     * 根据symbol删除股票代码
     */
    boolean deleteStockBySymbol(String symbol);

    /**
     * 查询所有股票（带ID）
     */
    List<Stock> getAllStocks();

    /**
     * 根据ID查询股票
     */
    Stock getStockById(Long id);

    void addWatchStock(String symbol);
    void removeWatchStock(String symbol);

    List<TransactionRecord> getTransactionRecordBySymbol(String symbol);
}