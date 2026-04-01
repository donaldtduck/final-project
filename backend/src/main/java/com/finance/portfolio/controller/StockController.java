//package com.finance.portfolio.controller;
//
//import com.finance.portfolio.model.dto.AddStockDto;
//import com.finance.portfolio.model.dto.StockQueryDto;
//import com.finance.portfolio.model.vo.StockHistoryVo;
//import com.finance.portfolio.service.StockService;
//import com.finance.portfolio.util.SinaStockApiUtil;
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.util.List;
//import java.util.Objects;
//
//@RestController
//@RequestMapping("/api/stock")
//@RequiredArgsConstructor
//public class StockController {
//
//    @Autowired
//    private StockService stockService;
//    private final SinaStockApiUtil sinaStockApiUtil;
//
//    @PostMapping("/history")
//    public List<StockHistoryVo> getStockHistory(@RequestBody StockQueryDto dto) {
//        return sinaStockApiUtil.getStockHistory(dto);
//    }
//
//    @PostMapping
//    public ResponseEntity<Object> addStock(@RequestBody AddStockDto addStockDto) {
//        stockService.addStock(addStockDto);
//        return ResponseEntity.ok().build();
//    }
//
//}



package com.finance.portfolio.controller;

import com.finance.portfolio.model.dto.AddStockDto;
import com.finance.portfolio.model.dto.StockQueryDto;
import com.finance.portfolio.model.entity.Asset;
import com.finance.portfolio.model.vo.ResultVo;
import com.finance.portfolio.model.vo.StockHistoryVo;
import com.finance.portfolio.service.StockService;
import com.finance.portfolio.util.SinaStockApiUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

        import java.util.List;

@RestController
@RequestMapping("/api/stock")
@RequiredArgsConstructor
public class StockController {
    @Autowired
    private StockService stockService;

    private final SinaStockApiUtil sinaStockApiUtil;

    /**
     * T3.1：添加资产到投资组合（POST API）
     * 满足AC3.1：接收股票代码、数量、购买日期等关键信息
     * 满足AC3.2：参数校验 + 错误提示
     * 满足AC3.3：添加成功后前端可刷新列表和图表
     */
    @PostMapping
    public ResultVo<String> addStock(@Valid @RequestBody AddStockDto addStockDto) {
        stockService.addStock(addStockDto);
        return ResultVo.success("资产添加成功");
    }

    /**
     * T3.2：获取所有可用股票（GET API）
     * 适配前端下拉选择框，无需用户手动输入完整代码
     */
    @GetMapping("/available")
    public ResultVo<List<Asset>> getAllAvailableStocks() {
        List<Asset> availableStocks = stockService.getAllAvailableStocks();
        return ResultVo.success(availableStocks);
    }

    /**
     * 原有历史记录查询接口，保持不变
     */
    @PostMapping("/history")
    public ResultVo<List<StockHistoryVo>> getStockHistory(@RequestBody StockQueryDto dto) {
        List<StockHistoryVo> history = sinaStockApiUtil.getStockHistory(dto);
        return ResultVo.success(history);
    }
}