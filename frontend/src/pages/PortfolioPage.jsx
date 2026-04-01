import { useState, useEffect } from 'react';
import PortfolioItem from '../components/PortfolioItem';
import PortfolioSummary from '../components/PortfolioSummary';
import Divider from '../components/Divider';
import Navbar from '../components/Navbar';

// === Mock Data ===
const mockPortfolio = [
    { id: 1, symbol: "AAPL", name: "Apple", volume: 50, purchasePrice: 120, currentPrice: 130, prevClose: 128 },
    { id: 2, symbol: "TSLA", name: "Tesla", volume: 10, purchasePrice: 700, currentPrice: 720, prevClose: 710 },
    { id: 3, symbol: "AMZN", name: "Amazon", volume: 5, purchasePrice: 3000, currentPrice: 3100, prevClose: 3050 },
    { id: 4, symbol: "MSFT", name: "Microsoft", volume: 20, purchasePrice: 250, currentPrice: 260, prevClose: 258 },
];

export default function PortfolioPage() {
    const [portfolio, setPortfolio] = useState([]);
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState('symbol'); // 默认按 symbol 排序
    const [sortOrder, setSortOrder] = useState('asc'); // asc 或 desc
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // setPortfolio(mockPortfolio);
        // setLoading(false);
        const fetchData = async () => {
            setLoading(true);

            const res = await getPortfolio();

            if (res && res.data) {
                // 🔥 后端返回的是 StockVo，要适配前端字段
                const mapped = res.data.map((item, index) => ({
                    id: index + 1,
                    symbol: item.symbol,
                    name: item.symbol, // 暂时用 symbol 代替 name
                    volume: item.volume,
                    purchasePrice: Number(item.purchasePrice),
                    currentPrice: Number(item.currentPrice),
                    prevClose: Number(item.currentPrice), // 临时用 currentPrice
                }));

                setPortfolio(mapped);
            }

            setLoading(false);
        };

        fetchData();
    }, []);

    const summary = {
        totalValue: portfolio.reduce((acc, i) => acc + (i.currentPrice * i.volume), 0),
        totalCost: portfolio.reduce((acc, i) => acc + (i.purchasePrice * i.volume), 0),
        unrealizedPL: portfolio.reduce((acc, i) => acc + ((i.currentPrice - i.purchasePrice) * i.volume), 0),
        realizedPL: 0,
        returnRate: portfolio.length
            ? portfolio.reduce((acc, i) => acc + ((i.currentPrice - i.purchasePrice) / i.purchasePrice), 0) / portfolio.length
            : 0,
        todayPL: portfolio.reduce((acc, i) => acc + ((i.currentPrice - i.prevClose) * i.volume), 0),
        todayChange: portfolio.length
            ? portfolio.reduce((acc, i) => acc + ((i.currentPrice - i.prevClose) / i.prevClose), 0) / portfolio.length
            : 0,
        holdings: portfolio.length
    };

    const performanceData = [
        { date: "2026-03-25", value: 100000 },
        { date: "2026-03-26", value: 102500 },
        { date: "2026-03-27", value: 104000 },
        { date: "2026-03-28", value: 107000 },
        { date: "2026-03-29", value: 110000 },
        { date: "2026-03-30", value: 123800 },
        { date: "2026-03-31", value: summary.totalValue }
    ];

    const pieData = portfolio.map(item => ({
        name: item.symbol,
        value: item.volume * item.currentPrice
    }));

    // 过滤 + 排序
    const filteredPortfolio = portfolio
        .filter(item => item.symbol.toLowerCase().includes(search.toLowerCase()) || item.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            let valA = a[sortKey];
            let valB = b[sortKey];
            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();
            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

    return (
        <div style={{ padding: '2rem', backgroundColor: '#111', minHeight: '100vh' }}>
            <Navbar
                onAddSuccess={(newItem) => {
                    setPortfolio(prev => [...prev, newItem]);
                }}
            />


            {/* PortfolioSummary */}
            <PortfolioSummary summary={summary} performanceData={performanceData} pieData={pieData} />

            <Divider />

            {/* 搜索 + 排序 */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    marginBottom: '1rem',
                }}
            >
                <input
                    type="text"
                    placeholder="Search symbol or name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        flex: '1 1 auto',
                        minWidth: '150px', // 搜索框短一点
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        border: 'none',
                        outline: 'none',
                        fontSize: '0.95rem',
                        background: 'linear-gradient(145deg, #030d2f, #1b0966)',
                        color: '#fff',
                        boxShadow:
                            '0 4px 12px rgba(218,112,214,0.4), 0 0 10px rgba(238,130,238,0.2) inset',
                        transition: 'box-shadow 0.3s, transform 0.3s',
                    }}
                    onFocus={(e) =>
                    (e.target.style.boxShadow =
                        '0 4px 12px rgba(218,112,214,0.8), 0 0 15px rgba(238,130,238,0.4) inset')
                    }
                    onBlur={(e) =>
                    (e.target.style.boxShadow =
                        '0 4px 12px rgba(218,112,214,0.4), 0 0 10px rgba(238,130,238,0.2) inset')
                    }
                />

                <select
                    value={sortKey}
                    onChange={(e) => setSortKey(e.target.value)}
                    style={{
                        minWidth: '100px',
                        flex: '0 0 auto',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        border: 'none',
                        outline: 'none',
                        background: 'linear-gradient(145deg, #030d2f, #1b0966)',
                        color: '#fff',
                        boxShadow:
                            '0 4px 12px rgba(218,112,214,0.4), 0 0 10px rgba(238,130,238,0.2) inset',
                        cursor: 'pointer',
                        transition: 'box-shadow 0.3s, transform 0.3s',
                    }}
                    onFocus={(e) =>
                    (e.target.style.boxShadow =
                        '0 4px 12px rgba(218,112,214,0.8), 0 0 15px rgba(238,130,238,0.4) inset')
                    }
                    onBlur={(e) =>
                    (e.target.style.boxShadow =
                        '0 4px 12px rgba(218,112,214,0.4), 0 0 10px rgba(238,130,238,0.2) inset')
                    }
                >
                    <option value="symbol">Symbol</option>
                    <option value="name">Name</option>
                    <option value="currentPrice">Current Price</option>
                    <option value="volume">Volume</option>
                </select>

                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    style={{
                        minWidth: '100px',
                        flex: '0 0 auto',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        border: 'none',
                        outline: 'none',
                        background: 'linear-gradient(145deg, #030d2f, #1b0966)',
                        color: '#fff',
                        boxShadow:
                            '0 4px 12px rgba(218,112,214,0.4), 0 0 10px rgba(238,130,238,0.2) inset',
                        cursor: 'pointer',
                        transition: 'box-shadow 0.3s, transform 0.3s',
                    }}
                    onFocus={(e) =>
                    (e.target.style.boxShadow =
                        '0 4px 12px rgba(218,112,214,0.8), 0 0 15px rgba(238,130,238,0.4) inset')
                    }
                    onBlur={(e) =>
                    (e.target.style.boxShadow =
                        '0 4px 12px rgba(218,112,214,0.4), 0 0 10px rgba(238,130,238,0.2) inset')
                    }
                >
                    <option value="asc">Asc</option>
                    <option value="desc">Desc</option>
                </select>
            </div>

            {/* PortfolioItem 列表，每行两个 */}
            {loading ? (
                <div style={{ color: '#fff' }}>Loading...</div>
            ) : filteredPortfolio.length === 0 ? (
                <div style={{ color: '#fff' }}>No items found.</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                    {filteredPortfolio.map(item => (
                        <PortfolioItem key={item.id} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
}