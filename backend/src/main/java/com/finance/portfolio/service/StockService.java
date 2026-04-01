//package com.finance.portfolio.service;
//
//import com.finance.portfolio.model.dto.AddStockDto;
//
//public interface StockService {
//
//    public void addStock(AddStockDto addStockDto);
//}



package com.finance.portfolio.service;

import com.finance.portfolio.model.dto.AddStockDto;
import com.finance.portfolio.model.entity.Asset;

import java.util.List;

public interface StockService {
    /**
     * 添加资产到投资组合
     */
    void addStock(AddStockDto addStockDto);

    /**
     * T3.2：获取所有可用股票（从新浪API查询常用股票列表）
     * 适配前端下拉选择需求，无需用户手动输入完整代码
     */
    List<Asset> getAllAvailableStocks();
}