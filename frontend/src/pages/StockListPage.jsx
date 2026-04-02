import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StockItem from '../components/StockItem';
import { getAllStocks } from '../api/portfolio';

export default function StockListPage() {
    const [stocks, setStocks] = useState([]);
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState('symbol');
    const [sortOrder, setSortOrder] = useState('asc');
    const [market, setMarket] = useState('all');
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

    const getStockMarket = (symbol) => {
        const s = symbol.toLowerCase();
        if (s.startsWith('sh') || s.startsWith('sz')) return 'a';
        if (s.startsWith('hk')) return 'hk';
        return 'us';
    };

    const filtered = stocks.filter(s => {
        const matchSearch = s.symbol.toLowerCase().includes(search.toLowerCase());
        const matchMarket = market === 'all' || getStockMarket(s.symbol) === market;
        return matchSearch && matchMarket;
    });

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

            {loading ? (
                // ———— 统一风格 Loading ————
                <div style={loadingContainerStyle}>
                    <div style={loadingCardStyle}>
                        <div style={spinnerStyle} />
                        <p style={loadingTextStyle}>Loading stock data...</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* 标题 */}
                    <h3 style={sectionTitleStyle}>All Stocks</h3>

                    {/* 搜索栏 */}
                    <div style={searchBarStyle}>
                        <input
                            type="text"
                            placeholder="Search symbol"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={inputStyle}
                        />

                        <select value={market} onChange={(e) => setMarket(e.target.value)} style={selectStyle}>
                            <option value="all">All Markets</option>
                            <option value="us">US Stocks</option>
                            <option value="a">A-Shares</option>
                            <option value="hk">HK Stocks</option>
                        </select>

                        <select value={sortKey} onChange={(e) => setSortKey(e.target.value)} style={selectStyle}>
                            <option value="symbol">Symbol</option>
                            <option value="currentPrice">Price</option>
                            <option value="priceChangeRate">Change %</option>
                        </select>

                        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={selectStyle}>
                            <option value="asc">Asc</option>
                            <option value="desc">Desc</option>
                        </select>
                    </div>

                    {/* 列表 —— 改为 每行1个 */}
                    <div style={listContainerStyle}>
                        {sorted.length === 0 ? (
                            <div style={emptyTextStyle}>No stocks found.</div>
                        ) : (
                            sorted.map((s) => (
                                <StockItem
                                    key={s.symbol}
                                    stock={s}
                                    onDelete={(symbol) => {
                                        setStocks(prev => prev.filter(item => item.symbol !== symbol));
                                    }}
                                />
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

// —————————— 统一 Loading 样式 ——————————
const loadingContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
};

const loadingCardStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.2rem',
    padding: '2.5rem 3rem',
    background: 'linear-gradient(145deg, #1b001b, #30021c)',
    borderRadius: '16px',
    boxShadow: '0 8px 25px rgba(155,27,77,0.5), 0 0 15px rgba(218,112,214,0.2) inset',
};

const spinnerStyle = {
    width: '42px',
    height: '42px',
    border: '3px solid rgba(255, 192, 245, 0.2)',
    borderTop: '3px solid #ff69b4',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
};

const loadingTextStyle = {
    color: '#ffc0f5',
    fontSize: '1rem',
    margin: 0,
    textShadow: '0 0 6px rgba(255, 192, 245, 0.4)',
};

// —————————— 页面样式 ——————————
const sectionTitleStyle = {
    color: '#ffc0f5',
    fontSize: '1.25rem',
    fontWeight: 600,
    margin: '0 0 1rem 0',
    textShadow: '0 0 6px rgba(255, 192, 245, 0.4)',
};

const searchBarStyle = {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.2rem',
    flexWrap: 'wrap',
};

const inputStyle = {
    flex: 1,
    minWidth: '180px',
    padding: '0.6rem 1rem',
    borderRadius: '8px',
    border: 'none',
    outline: 'none',
    background: '#1e1a3a',
    color: '#fff',
    boxShadow: '0 4px 12px rgba(218,112,214,0.4)',
};

const selectStyle = {
    padding: '0.6rem 1rem',
    borderRadius: '8px',
    border: 'none',
    background: '#1e1a3a',
    color: '#fff',
};

// 👇 重点：改为 1列 每行一个
const listContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, 1fr)', // 1个每行
    gap: '1rem',
};

const emptyTextStyle = {
    color: '#fff',
    fontSize: '1rem',
    padding: '1rem',
};