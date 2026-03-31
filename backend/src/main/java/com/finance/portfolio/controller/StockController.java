package com.finance.portfolio.controller;

import com.finance.portfolio.model.dto.AddStockDto;
import com.finance.portfolio.model.dto.StockQueryDto;
import com.finance.portfolio.model.vo.StockHistoryVo;
import com.finance.portfolio.service.StockService;
import com.finance.portfolio.util.SinaStockApiUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/stock")
@RequiredArgsConstructor
public class StockController {

    @Autowired
    private StockService stockService;
    private final SinaStockApiUtil sinaStockApiUtil;

    @PostMapping("/history")
    public List<StockHistoryVo> getStockHistory(@RequestBody StockQueryDto dto) {
        return sinaStockApiUtil.getStockHistory(dto);
    }

    @PostMapping
    public ResponseEntity<Object> addStock(@RequestBody AddStockDto addStockDto) {
        stockService.addStock(addStockDto);
        return ResponseEntity.ok().build();
    }

}