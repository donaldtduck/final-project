import { useState, useEffect } from 'react';
import PortfolioItem from '../components/PortfolioItem';
import PortfolioSummary from '../components/PortfolioSummary';
import Divider from '../components/Divider';

// === Mock Data ===
const mockPortfolio = [
    { id: 1, symbol: "AAPL", name: "Apple", volume: 50, purchasePrice: 120, currentPrice: 130, prevClose: 128 },
    { id: 2, symbol: "TSLA", name: "Tesla", volume: 10, purchasePrice: 700, currentPrice: 720, prevClose: 710 },
    { id: 3, symbol: "AMZN", name: "Amazon", volume: 5, purchasePrice: 3000, currentPrice: 3100, prevClose: 3050 },
    { id: 4, symbol: "MSFT", name: "Microsoft", volume: 20, purchasePrice: 250, currentPrice: 260, prevClose: 258 },
];

export default function PortfolioPage() {
    const [portfolio, setPortfolio] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 使用 mock 数据直接渲染
        setPortfolio(mockPortfolio);
        setLoading(false);
    }, []);

    const summary = {
        totalValue: portfolio.reduce((acc, i) => acc + (i.currentPrice * i.volume), 0),
        totalCost: portfolio.reduce((acc, i) => acc + (i.purchasePrice * i.volume), 0),
        unrealizedPL: portfolio.reduce((acc, i) => acc + ((i.currentPrice - i.purchasePrice) * i.volume), 0),
        realizedPL: 0, // placeholder
        returnRate: portfolio.length
            ? portfolio.reduce((acc, i) => acc + ((i.currentPrice - i.purchasePrice) / i.purchasePrice), 0) / portfolio.length
            : 0,
        todayPL: portfolio.reduce((acc, i) => acc + ((i.currentPrice - i.prevClose) * i.volume), 0),
        todayChange: portfolio.length
            ? portfolio.reduce((acc, i) => acc + ((i.currentPrice - i.prevClose) / i.prevClose), 0) / portfolio.length
            : 0,
        holdings: portfolio.length
    };

    // performanceData: 模拟每日总资产变化，用于折线图
    const performanceData = [
        { date: "2026-03-25", value: 100000 },
        { date: "2026-03-26", value: 102500 },
        { date: "2026-03-27", value: 104000 },
        { date: "2026-03-28", value: 107000 },
        { date: "2026-03-29", value: 110000 },
        { date: "2026-03-30", value: 123800 },
        { date: "2026-03-31", value: summary.totalValue }
    ];

    return (
        <div style={{ padding: '2rem', backgroundColor: '#111', minHeight: '100vh' }}>
            <h1 style={{ color: '#ff1493', marginBottom: '2rem', fontSize: '2rem' }}>My Portfolio</h1>
            <PortfolioSummary summary={summary} performanceData={performanceData} />
            <Divider />
            <button
                onClick={() => setPortfolio(mockPortfolio)}
                style={{
                    marginBottom: '1rem',
                    padding: '0.5rem 1rem',
                    background: '#6e0b2c',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(110,11,44,0.6)'
                }}
            >
                Refresh
            </button>
            {loading ? (
                <div style={{ color: '#fff' }}>Loading...</div>
            ) : portfolio.length === 0 ? (
                <div style={{ color: '#fff' }}>Your portfolio is empty.</div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {portfolio.map(item => (
                        <PortfolioItem key={item.id} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
}