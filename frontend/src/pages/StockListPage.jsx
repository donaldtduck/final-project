import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StockItem from '../components/StockItem';
import { getAllStocks } from '../api/portfolio';

export default function StockListPage() {
    const [stocks, setStocks] = useState([]);
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState('symbol');
    const [sortOrder, setSortOrder] = useState('asc');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const data = await getAllStocks();
            setStocks(data || []);
            setLoading(false);
        };
        fetch();
    }, []);

    // 过滤
    const filtered = stocks.filter(s =>
        s.symbol.toLowerCase().includes(search.toLowerCase())
    );

    // 排序
    const sorted = [...filtered].sort((a, b) => {
        let aVal = a[sortKey];
        let bVal = b[sortKey];

        if (sortKey === 'currentPrice' || sortKey === 'priceChangeRate') {
            aVal = Number(aVal);
            bVal = Number(bVal);
        } else {
            aVal = String(aVal).toLowerCase();
            bVal = String(bVal).toLowerCase();
        }

        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    return (
        <div style={{ padding: '2rem', background: '#111', minHeight: '100vh' }}>
            <Navbar />

            {/* 搜索 + 排序 */}
            <div style={{
                display: 'flex', gap: '1rem', margin: '1rem 0', flexWrap: 'wrap'
            }}>
                <input
                    type="text"
                    placeholder="Search symbol"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        flex: 1, minWidth: '160px', padding: '0.6rem 1rem',
                        borderRadius: '8px', border: 'none', outline: 'none',
                        background: 'linear-gradient(145deg, #030d2f, #1b0966)',
                        color: '#fff',
                        boxShadow: '0 4px 12px rgba(218,112,214,0.4)',
                    }}
                />

                <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}
                    style={{
                        padding: '0.6rem 1rem', borderRadius: 8, border: 'none',
                        background: 'linear-gradient(145deg, #030d2f, #1b0966)', color: '#fff'
                    }}>
                    <option value="symbol">Symbol</option>
                    <option value="currentPrice">Price</option>
                    <option value="priceChangeRate">Change %</option>
                </select>

                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}
                    style={{
                        padding: '0.6rem 1rem', borderRadius: 8, border: 'none',
                        background: 'linear-gradient(145deg, #030d2f, #1b0966)', color: '#fff'
                    }}>
                    <option value="asc">Asc</option>
                    <option value="desc">Desc</option>
                </select>
            </div>

            {/* 列表 */}
            {loading ? (
                <div style={{ color: '#fff' }}>Loading...</div>
            ) : sorted.length === 0 ? (
                <div style={{ color: '#fff' }}>No stocks found.</div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1rem',
                }}>
                    {sorted.map((s, idx) => (
                        <StockItem key={s.symbol || idx} stock={s} />
                    ))}
                </div>
            )}
        </div>
    );
}