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

// 取消订阅（删除自选）
export async function unsubscribeStock(symbol) {
    try {
        const res = await fetch(
            `${BASE_URL}/stock/watch?symbol=${encodeURIComponent(symbol)}`,
            { method: 'DELETE' }
        );
        if (!res.ok) throw new Error('Unsubscribe failed');
        // 🔥 只改这里：不解析 JSON，直接返回成功
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

// 订阅也一起修一下
export async function subscribeStock(symbol) {
    try {
        const res = await fetch(
            `${BASE_URL}/stock/watch?symbol=${encodeURIComponent(symbol)}`,
            { method: 'POST' }
        );
        if (!res.ok) throw new Error('Subscribe failed');
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

// 收集当前页面所有信息并发送到后端
const sendPortfolioDataToBackend = async () => {
    const payload = {
        // 持仓列表
        holdings: portfolio,
        // 总览数据
        summary: summary,
        // 时间戳，方便后端记录
        capturedAt: new Date().toISOString()
    };

    try {
        const res = await fetch('http://localhost:8080/api/portfolio/capture', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert('页面信息已发送到后端');
        }
    } catch (err) {
        console.error('发送失败', err);
    }
};

// =========================
// ✅ AI 聊天接口（统一使用 BASE_URL）
// =========================
export async function sendAIChat(requestData) {
    try {
        const res = await fetch(`${BASE_URL}/ai/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData),
        });

        if (!res.ok) throw new Error("AI chat failed");
        return await res.json();
    } catch (error) {
        console.error("AI chat error:", error);
        return null;
    }
}