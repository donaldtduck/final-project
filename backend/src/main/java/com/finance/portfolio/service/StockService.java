package com.finance.portfolio.service;

import com.finance.portfolio.model.dto.AddStockDto;
import com.finance.portfolio.model.vo.StockVo;

import java.util.List;

public interface StockService {

    public void addStock(AddStockDto addStockDto);

    List<StockVo> getStockListWithPnl();
}
