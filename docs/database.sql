-- 1. 创建数据库
CREATE DATABASE IF NOT EXISTS financial_portfolio DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE financial_portfolio;

-- 2. 用户表 (存储基本信息及可用余额)
CREATE TABLE IF NOT EXISTS `user` (
`username` VARCHAR(50) NOT NULL COMMENT '用户名',
`balance` DECIMAL(18, 2) DEFAULT 0.00 COMMENT '账户可用余额',
PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. 资产信息表 (存储资产的基础属性)
CREATE TABLE IF NOT EXISTS `asset` (
`symbol` VARCHAR(20) NOT NULL COMMENT '资产代码 (如 sh600519)',
`name` VARCHAR(50) NOT NULL COMMENT '资产名称',
`type` VARCHAR(20) COMMENT '资产类型 (STOCK/BOND/CASH)',
`avg_price` DECIMAL(18, 4) DEFAULT 0.0000 COMMENT '平均买入成本价',
PRIMARY KEY (`symbol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. 交易记录表 (记录每一笔买入卖出)
CREATE TABLE IF NOT EXISTS `transaction_record` (
`id` INT AUTO_INCREMENT COMMENT '交易唯一标识',
`symbol` VARCHAR(20) NOT NULL COMMENT '关联的资产代码',
`quantity` DECIMAL(18, 4) NOT NULL COMMENT '交易数量 (正数为买入，负数为卖出)',
`price` DECIMAL(18, 4) NOT NULL COMMENT '交易单价',
`date` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '交易时间',
PRIMARY KEY (`id`),
INDEX `idx_symbol` (`symbol`) -- 为代码建立索引，加速持仓查询
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. 充值记录表 (记录资金入账历史)
CREATE TABLE IF NOT EXISTS `deposit_record` (
`id` INT AUTO_INCREMENT COMMENT '充值唯一标识',
`price` DECIMAL(18, 2) NOT NULL COMMENT '充值金额',
`date` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '充值时间',
PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. 插入一条初始用户数据进行测试
INSERT INTO `user` (`username`, `balance`) VALUES ('Admin', 100000.00);