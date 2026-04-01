package com.finance.portfolio.service;

import com.finance.portfolio.model.vo.PortfolioChartVo;
import com.finance.portfolio.model.vo.PortfolioOverviewVo;

public interface PortfolioService {
    PortfolioOverviewVo getOverview();

    PortfolioChartVo getPortfolioChart();
}