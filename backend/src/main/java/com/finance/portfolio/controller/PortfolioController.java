package com.finance.portfolio.controller;

import com.finance.portfolio.model.vo.PortfolioOverviewVo;
import com.finance.portfolio.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/portfolio")
@RequiredArgsConstructor
public class PortfolioController {
    @Autowired
    PortfolioService portfolioService;

    /**
     * 获取投资组合总览数据
     */
    @GetMapping("/overview")
    public PortfolioOverviewVo getOverview() {
        return portfolioService.getOverview();
    }
}