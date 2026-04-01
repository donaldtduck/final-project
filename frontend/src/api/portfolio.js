const BASE_URL = 'http://localhost:8080/api/stock';

// ✅ 获取所有股票
export async function getPortfolio() {
    try {
        const res = await fetch(BASE_URL + '/holdings');

        if (!res.ok) {
            const err = await res.text();
            throw new Error(err || 'Failed to fetch portfolio');
        }

        return await res.json();
    } catch (error) {
        console.error('Fetch portfolio error:', error);
        return [];
    }
}

export async function getStockPerformance(symbol, slice = 30, unit = 'DAY') {
    try {
        const res = await fetch(
            `http://localhost:8080/api/stock/performance/${symbol}/${slice}/${unit}`
        );

        if (!res.ok) throw new Error('Failed to fetch performance');

        return await res.json();
    } catch (err) {
        console.error(err);
        return null;
    }
}

export async function addPortfolioItem(item) {
    try {
        console.log("hahahahahaha");
        const res = await fetch('http://localhost:8080/api/stock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error(err || 'Failed to add item');
        }

        return await res.json();
    } catch (error) {
        console.error('Add item error:', error);
        return null;
    }
}

