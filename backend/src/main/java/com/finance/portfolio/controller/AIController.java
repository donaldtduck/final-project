package com.finance.portfolio.controller;

import com.finance.portfolio.model.dto.AIChatRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final WebClient deepSeekWebClient;

    @PostMapping("/chat")
    public Mono<Map<String, Object>> chat(@RequestBody AIChatRequest req) {

        String prompt = """
        You are a professional, friendly stock investment assistant.
        
        RULES:
        1. If the user is just chatting (greeting, hi, hello, how are you), chat casually and reply briefly.
        2. Only if the user asks for ANALYSIS, ADVICE, PORTFOLIO, RISK, or STOCK HELP, use the portfolio data below to give professional suggestions.
        3. Do NOT mention or use the portfolio data unless the user asks for analysis.
        4. Keep replies clear, concise, professional, and easy to understand.
        
        Here is the user's portfolio (for analysis only):
        Total Value: %.2f
        Today P&L: %.2f
        Holdings: %d
        Positions: %s
        
        User's question: %s
        """.formatted(
                req.getSummary().getTotalValue(),
                req.getSummary().getTodayPL(),
                req.getSummary().getHoldings(),
                req.getPortfolio().toString(),
                req.getUserMessage()
        );

        var body = Map.of(
                "model", "deepseek-chat",
                "messages", new Object[]{
                        Map.of("role", "user", "content", prompt)
                }
        );

        return deepSeekWebClient.post()
                .uri("/v1/chat/completions")
                .bodyValue(body)
                .retrieve()
                .bodyToMono((Class<Map<String, Object>>) (Class<?>) Map.class);
    }
}