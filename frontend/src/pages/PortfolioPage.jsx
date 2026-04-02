import { useState, useEffect } from 'react';
import PortfolioItem from '../components/PortfolioItem';
import PortfolioSummary from '../components/PortfolioSummary';
import Divider from '../components/Divider';
import Navbar from '../components/Navbar';
import AIChatPanel from '../components/AIChatPanel';
import { getPortfolio, getPortfolioOverview, getPortfolioChart } from '../api/portfolio';

export default function PortfolioPage() {
    const [portfolio, setPortfolio] = useState([]);
    const [summary, setSummary] = useState({});
    const [chartData, setChartData] = useState([]);
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState('symbol');
    const [sortOrder, setSortOrder] = useState('asc');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAll = async () => {
            setLoading(true);
            const overview = await getPortfolioOverview();
            const holdings = await getPortfolio();
            const chart = await getPortfolioChart();

            setSummary(overview);
            setPortfolio(holdings || []);

            const formatted = chart?.navList?.map((nav, i) => ({
                date: nav.date,
                value: nav.totalNav,
                cost: chart.costList[i]?.totalCost || 0,
            })) || [];
            setChartData(formatted);
            setLoading(false);
        };
        loadAll();
    }, []);

    const filteredPortfolio = portfolio
        .filter(item =>
            item.symbol.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            let valA = a[sortKey];
            let valB = b[sortKey];
            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();
            return sortOrder === 'asc' ? (valA < valB ? -1 : 1) : (valA > valB ? -1 : 1);
        });

    return (
        <div style={{ padding: '2rem', backgroundColor: '#111', minHeight: '100vh' }}>
            <Navbar onAddSuccess={() => { }} />

            {loading ? (
                <div style={pageLoadingStyle}>
                    <div style={loadingBoxStyle}>
                        <div style={loadingSpinnerStyle} />
                        <p style={loadingTextStyle}>Loading portfolio data...</p>
                    </div>
                </div>
            ) : (
                <>
                    <PortfolioSummary
                        overview={summary}
                        holdings={portfolio}
                        chartData={chartData}
                    />

                    <Divider />

                    <div style={{ display: 'flex', gap: '2rem' }}>

                        {/* ========== 左边：持仓区域 ========== */}
                        <div style={leftContainerStyle}>
                            {/* 👇 这里加了持仓区域标题 */}
                            <h3 style={sectionTitleStyle}>My Positions</h3>

                            <div style={searchBarStyle}>
                                <input
                                    type="text"
                                    placeholder="Search symbol"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={searchInputStyle}
                                />
                                <select value={sortKey} onChange={(e) => setSortKey(e.target.value)} style={selectStyle}>
                                    <option value="symbol">Symbol</option>
                                    <option value="volume">Volume</option>
                                </select>
                                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={selectStyle}>
                                    <option value="asc">Asc</option>
                                    <option value="desc">Desc</option>
                                </select>
                            </div>

                            {/* 内部滚动区域 */}
                            <div style={listScrollStyle}>
                                {filteredPortfolio.map(item => (
                                    <PortfolioItem key={item.id} item={item} />
                                ))}
                            </div>
                        </div>

                        {/* 右边 AI 聊天 */}
                        <div style={{ flex: 1 }}>
                            <AIChatPanel portfolio={portfolio} summary={summary} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// ———— Loading 样式 ————
const pageLoadingStyle = {
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const loadingBoxStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.2rem',
    padding: '2.5rem 3rem',
    background: 'linear-gradient(145deg, #1b001b, #30021c)',
    borderRadius: '16px',
    boxShadow: '0 8px 25px rgba(155,27,77,0.5), 0 0 15px rgba(218,112,214,0.2) inset',
};

const loadingSpinnerStyle = {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(255,192,245,0.2)',
    borderTop: '3px solid #ff69b4',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
};

const loadingTextStyle = {
    color: '#ffc0f5',
    fontSize: '1rem',
    margin: 0,
    textShadow: '0 0 6px rgba(255,192,245,0.4)',
};

// ———— 左边区域 ————
const leftContainerStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    height: '720px',
};

// 👇 持仓区域标题样式（和你整体风格一致）
const sectionTitleStyle = {
    color: '#ffc0f5',
    fontSize: '1.25rem',
    fontWeight: 600,
    margin: '0 0 0.2rem 0',
    textShadow: '0 0 6px rgba(255,192,245,0.4)',
};

const searchBarStyle = {
    display: 'flex',
    gap: '1rem',
    marginBottom: '0.5rem',
};

const listScrollStyle = {
    flex: 1,
    overflowY: 'auto',
    display: 'grid',
    gap: '1rem',
    paddingRight: '4px',
};

// ———— 输入框样式 ————
const searchInputStyle = {
    flex: 1,
    padding: '0.5rem 1rem',
    borderRadius: 6,
    border: 'none',
    background: '#1e1a3a',
    color: '#fff',
};

const selectStyle = {
    padding: '0.5rem 1rem',
    background: '#030d2f',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
};