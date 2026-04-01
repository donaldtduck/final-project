
package com.finance.portfolio.service;

import com.finance.portfolio.model.dto.AddStockDto;
import com.finance.portfolio.model.dto.PerformanceQueryDto;
import com.finance.portfolio.model.dto.RemoveStockDto;
import com.finance.portfolio.model.entity.TransactionRecord;
import com.finance.portfolio.model.vo.MyStockPerformanceVo;
import com.finance.portfolio.model.vo.StockVo;

import java.util.List;

public interface StockService {

    public void addStock(AddStockDto addStockDto);

    List<StockVo> getStockListWithPnl();


    List<StockVo> getStockHoldings();

    // 新增：用户故事4：移除资产
    void removeStock(RemoveStockDto removeStockDto);

    public MyStockPerformanceVo getMyStockPerformance(PerformanceQueryDto performanceQueryDto);
}