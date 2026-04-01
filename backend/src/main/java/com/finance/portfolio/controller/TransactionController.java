package com.finance.portfolio.controller;

import com.finance.portfolio.model.dto.TransactionRequest;
import com.finance.portfolio.model.entity.TransactionRecord;
import com.finance.portfolio.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping("/calculate-and-save")
    public TransactionRecord createTransaction(@RequestBody TransactionRequest request) {
        return transactionService.processTransaction(request);
    }
}