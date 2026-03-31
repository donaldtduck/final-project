package com.finance.portfolio.controller;

import com.finance.portfolio.service.MarketDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/market")
public class MarketDemoController {

    @Autowired
    private MarketDataService marketDataService;

    // 测试地址：http://localhost:8080/api/market/quote/sh600519
    @GetMapping("/quote/{symbol}")
    public Map<String, Object> getQuote(@PathVariable String symbol) {
        return marketDataService.fetchLiveQuote(symbol);
    }
}
