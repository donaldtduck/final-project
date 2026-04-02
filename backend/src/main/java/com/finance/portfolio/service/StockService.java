
package com.finance.portfolio.service;

import com.finance.portfolio.model.dto.AddStockDto;
import com.finance.portfolio.model.dto.PerformanceQueryDto;
import com.finance.portfolio.model.dto.RemoveStockDto;
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
}