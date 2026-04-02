package com.finance.portfolio.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class DeepSeekConfig {

    @Bean
    public WebClient deepSeekWebClient() {
        return WebClient.builder()
                .baseUrl("https://api.deepseek.com")
                .defaultHeader("Authorization", "Bearer sk-34ce3b63270f498daf2e8815fe3b1ad9")
                .defaultHeader("Content-Type", "application/json")
                .build();
    }
}