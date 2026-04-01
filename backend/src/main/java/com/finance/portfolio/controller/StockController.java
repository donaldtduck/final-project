package com.finance.portfolio.controller;

import com.finance.portfolio.enums.TimeUnitEnum;
import com.finance.portfolio.model.dto.AddStockDto;
import com.finance.portfolio.model.dto.PerformanceQueryDto;
import com.finance.portfolio.model.dto.RemoveStockDto;
import com.finance.portfolio.model.dto.StockQueryDto;
import com.finance.portfolio.model.vo.MyStockPerformanceVo;
import com.finance.portfolio.model.vo.StockHistoryVo;
import com.finance.portfolio.model.vo.StockVo;
import com.finance.portfolio.service.MarketDataRouter;
import com.finance.portfolio.service.StockService;
import com.finance.portfolio.service.impl.SinaCNMarketDataService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock")
@RequiredArgsConstructor
public class StockController {

    @Autowired
    private StockService stockService;
    @Autowired
    private MarketDataRouter marketDataRouter;

    @PostMapping("/history")
    public List<StockHistoryVo> getStockHistory(@RequestBody StockQueryDto dto) {
        return marketDataRouter.route(dto.getSymbol()).getStockHistory(dto);
    }

    @PostMapping
    public ResponseEntity<Object> addStock(@RequestBody AddStockDto addStockDto) {
        stockService.addStock(addStockDto);
        return ResponseEntity.ok().build();
    }

    /**
     * GET 请求：返回所有持仓股票的列表（包含盈亏计算）
     */
    @GetMapping("/holdings")
    public ResponseEntity<List<StockVo>> getStockList() {
        List<StockVo> stockListWithPnl = stockService.getStockListWithPnl();
        return ResponseEntity.ok(stockListWithPnl);
    }

    // ====== 新增：用户故事4 - 移除资产接口 ======
    @PutMapping("/remove")
    public ResponseEntity<String> removeStock(@Valid @RequestBody RemoveStockDto removeStockDto) {
        stockService.removeStock(removeStockDto);
        return ResponseEntity.ok("资产移除成功"); // 直接返回ok，符合需求
    }

    /**
     * 接口地址：GET /api/stock/performance/{symbol}/{slice}/{unit}
     * 示例：GET /api/stock/performance/sh600000/30/DAY
     */
    @GetMapping("/performance/{symbol}/{slice}/{unit}")
    public ResponseEntity<MyStockPerformanceVo> getMyStockPerformance(
            @PathVariable String symbol,
            @PathVariable Integer slice,
            @PathVariable String unit
    ) {
        // 1. 封装成 DTO
        PerformanceQueryDto dto = new PerformanceQueryDto();
        dto.setSymbol(symbol);
        dto.setSlice(slice);
        dto.setUnit(TimeUnitEnum.valueOf(unit.toUpperCase()));

        // 2. 调用你的 Service
        MyStockPerformanceVo performance = stockService.getMyStockPerformance(dto);

        // 3. 返回结果
        return ResponseEntity.ok(performance);
    }

}