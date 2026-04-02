package com.finance.portfolio.controller;

import com.finance.portfolio.enums.TimeUnitEnum;
import com.finance.portfolio.model.dto.*;
import com.finance.portfolio.model.entity.Stock;
import com.finance.portfolio.model.entity.TransactionRecord;
import com.finance.portfolio.model.vo.MyStockPerformanceVo;
import com.finance.portfolio.model.vo.StockHistoryVo;
import com.finance.portfolio.model.vo.StockSnapshotVo;
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

    @GetMapping("/transactions/{symbol}")
    public ResponseEntity<List<TransactionRecord>> getTransactionRecordBySymbol(@PathVariable("symbol") String symbol) {
        List<TransactionRecord> transactionRecordBySymbol = stockService.getTransactionRecordBySymbol(symbol);
        return ResponseEntity.ok(transactionRecordBySymbol);
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

    @GetMapping("/all")
    public ResponseEntity<List<StockSnapshotVo>> getAllStocks() {
        List<StockSnapshotVo> allStockSnapshots = stockService.getAllStockSnapshots();
        return ResponseEntity.ok(allStockSnapshots);
    }

    // ===================== 新增增/删/查接口 =====================
    /**
     * 新增股票代码（返回ID）
     * POST /api/stock/symbol
     * 请求体：{"symbol":"sh600000"}
     */
    @PostMapping("/symbol")
    public ResponseEntity<Long> addStockSymbol(@RequestBody StockDto stockDto) {
        Long id = stockService.addStockSymbol(stockDto);
        return ResponseEntity.ok(id);
    }

    /**
     * 根据ID删除股票代码
     * DELETE /api/stock/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteStockById(@PathVariable Long id) {
        boolean success = stockService.deleteStockById(id);
        return ResponseEntity.ok(success);
    }

    /**
     * 根据symbol删除股票代码
     * DELETE /api/stock/symbol/{symbol}
     */
    @DeleteMapping("/symbol/{symbol}")
    public ResponseEntity<Boolean> deleteStockBySymbol(@PathVariable String symbol) {
        boolean success = stockService.deleteStockBySymbol(symbol);
        return ResponseEntity.ok(success);
    }

    /**
     * 查询所有股票（带ID）
     * GET /api/stock/symbols
     */
    @GetMapping("/symbols")
    public ResponseEntity<List<Stock>> getAllStockSymbols() {
        List<Stock> stocks = stockService.getAllStocks();
        return ResponseEntity.ok(stocks);
    }

    /**
     * 根据ID查询股票
     * GET /api/stock/symbol/{id}
     */
    @GetMapping("/symbol/{id}")
    public ResponseEntity<Stock> getStockById(@PathVariable Long id) {
        Stock stock = stockService.getStockById(id);
        return ResponseEntity.ok(stock);
    }

    // =============================
    // 🔥 固定路径 /watch 必须写在上面
    // =============================
    @PostMapping("/watch")
    public ResponseEntity<String> addWatch(@RequestParam String symbol) {
        stockService.addWatchStock(symbol);
        return ResponseEntity.ok("subscribed");
    }

    @DeleteMapping("/watch")
    public ResponseEntity<String> removeWatch(@RequestParam String symbol) {
        stockService.removeWatchStock(symbol);
        return ResponseEntity.ok("unsubscribed");
    }

}