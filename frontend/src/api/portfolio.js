const BASE_URL = '/api/portfolio';

export async function getPortfolio(sortBy = 'ticker', order = 'asc') {
    try {
        const res = await fetch(`${BASE_URL}?sortBy=${sortBy}&order=${order}`);
        if (!res.ok) throw new Error('Failed to fetch portfolio');
        return await res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getPortfolioItem(id) {
    try {
        const res = await fetch(`${BASE_URL}/${id}`);
        if (!res.ok) throw new Error('Failed to fetch portfolio item');
        return await res.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function addPortfolioItem(item) {
    try {
        const res = await fetch('/api/stock', {
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

export async function deletePortfolioItem(id) {
    try {
        const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete item');
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}