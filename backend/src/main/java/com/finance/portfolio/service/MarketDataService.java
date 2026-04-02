package com.finance.portfolio.service;

import com.finance.portfolio.model.dto.StockQueryDto;
import com.finance.portfolio.model.vo.StockHistoryVo;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface MarketDataService {

    List<StockHistoryVo> getStockHistory(StockQueryDto dto);

    BigDecimal getClosePriceByDate(String symbol, LocalDateTime dateTime);

    BigDecimal getCurrentPrice(String symbol);

    BigDecimal getLastClosePrice(String symbol);

}