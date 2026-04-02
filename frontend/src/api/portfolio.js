const BASE_URL = "http://localhost:8080/api";

// ✅ 获取所有股票
export async function getPortfolio() {
    try {
        const res = await fetch(BASE_URL + "/stock/holdings");

        if (!res.ok) {
            const err = await res.text();
            throw new Error(err || "Failed to fetch portfolio");
        }

        return await res.json();
    } catch (error) {
        console.error("Fetch portfolio error:", error);
        return [];
    }
}

export async function getStockPerformance(symbol, slice = 30, unit = "DAY") {
    try {
        const res = await fetch(
            `${BASE_URL}/stock/performance/${symbol}/${slice}/${unit}`
        );

        if (!res.ok) throw new Error("Failed to fetch performance");

        return await res.json();
    } catch (err) {
        console.error(err);
        return null;
    }
}

export async function addPortfolioItem(item) {
    try {
        const res = await fetch(BASE_URL + "/stock", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
        });

        if (res.status === 204 || res.headers.get('content-length') === '0') {
            return {};
        }

        return await res.json();
    } catch (error) {
        console.error("Add item error:", error);
        return null;
    }
}

// =========================
// ✅ 你需要的两个新接口
// =========================

// 1. 获取总览 8 个指标
export async function getPortfolioOverview() {
    try {
        const res = await fetch(`${BASE_URL}/portfolio/overview`);
        if (!res.ok) throw new Error("Failed to fetch overview");
        return await res.json();
    } catch (err) {
        console.error(err);
        return {
            totalValue: 0,
            totalCost: 0,
            unrealizedPnl: 0,
            realizedPnl: 0,
            returnRate: 0,
            todayPnl: 0,
            todayChange: 0,
            totalHoldings: 0,
        };
    }
}

// 2. 获取图表数据（市值 + 成本）
export async function getPortfolioChart() {
    try {
        const res = await fetch(`${BASE_URL}/portfolio/chart`);
        if (!res.ok) throw new Error("Failed to fetch chart");
        return await res.json();
    } catch (err) {
        console.error(err);
        return { navList: [], costList: [] };
    }
}

// =========================
// ✅ 获取全部股票快照（你要的 /all）
// =========================
export async function getAllStocks() {
    try {
        const res = await fetch(`${BASE_URL}/stock/all`);
        if (!res.ok) throw new Error("Failed to fetch all stocks");
        return await res.json();
    } catch (err) {
        console.error(err);
        return [];
    }
}