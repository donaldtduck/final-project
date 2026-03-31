package com.finance.portfolio.service;

import com.finance.portfolio.util.SinaApiParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class MarketDataService {

    @Autowired
    private RestTemplate restTemplate;

    public Map<String, Object> fetchLiveQuote(String symbol) {
        String url = "http://hq.sinajs.cn/list=" + symbol;

        // 1. 创建请求头，模拟浏览器
        HttpHeaders headers = new HttpHeaders();
        // 关键点：必须添加 Referer 字段，新浪现在会校验这个
        headers.set("Referer", "https://finance.sina.com.cn");
        // 关键点：模拟常见的浏览器 User-Agent
        headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            // 2. 使用 exchange 方法发起带 Header 的请求
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            // 3. 解析结果
            return SinaApiParser.parse(symbol, response.getBody());
        } catch (Exception e) {
            Map<String, Object> errorMap = new HashMap<>();
            errorMap.put("error", "获取数据失败: " + e.getMessage());
            return errorMap;
        }
    }
}