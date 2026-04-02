package com.finance.portfolio.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
public class MarketDataRouter {

    private final MarketDataService sinaCN;
    private final MarketDataService alphaUS;
    private final MarketDataService sinaHK;

    // 自动注入所有实现
    @Autowired
    public MarketDataRouter(
            @Qualifier("sinaCNMarketDataService") MarketDataService sinaCN,
            @Qualifier("finnhubUSMarketDataService") MarketDataService alphaUS,
            @Qualifier("sinaHKMarketDataService")  MarketDataService sinaHK
    ) {
        this.sinaCN = sinaCN;
        this.alphaUS = alphaUS;
        this.sinaHK = sinaHK;
    }

    // 自动路由
    public MarketDataService route(String symbol) {
        if (symbol == null) return alphaUS;

        String s = symbol.toLowerCase();

        // A股：sh / sz 开头
        if (s.startsWith("sh") || s.startsWith("sz")) {
            return sinaCN;
        }

        // 港股：hk开头 / 纯5位数字 / 0开头数字
        else if (s.startsWith("hk") || s.matches("\\d{5}") || s.startsWith("0")) {
            return sinaHK;
        }

        // 其他 → 美股
        else {
            return alphaUS;
        }
    }

}