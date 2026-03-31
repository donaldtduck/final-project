package com.finance.portfolio.util;

import java.util.*;

public class SinaApiParser {
    public static Map<String, Object> parse(String symbol, String rawData) {
        Map<String, Object> data = new HashMap<>();
        try {
            // 提取双引号内容
            String content = rawData.substring(rawData.indexOf("\"") + 1, rawData.lastIndexOf("\""));
            String[] parts = content.split(",");

            if (parts.length > 1) {
                data.put("symbol", symbol);
                data.put("name", parts[0]);       // 股票名称
                data.put("open", parts[1]);       // 今日开盘价
                data.put("close", parts[2]);      // 昨日收盘价
                data.put("current", parts[3]);    // 当前价格
                data.put("high", parts[4]);       // 今日最高价
                data.put("low", parts[5]);        // 今日最低价
                data.put("time", parts[31]);      // 数据时间
            }
        } catch (Exception e) {
            data.put("error", "解析失败，请检查代码是否正确（如 sh600519）");
        }
        return data;
    }
}