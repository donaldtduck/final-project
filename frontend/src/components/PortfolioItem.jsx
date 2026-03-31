import { useState } from 'react';
import './PortfolioItem.css';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function PortfolioItem({ item, performanceData }) {
    const [expanded, setExpanded] = useState(false);

    const unrealizedPL = (item.currentPrice - item.purchasePrice) * item.volume;
    const todayPL = (item.currentPrice - item.prevClose) * item.volume;

    const plColor = (value) => (value >= 0 ? 'green' : 'red');

    // 点击卡片切换展开
    const toggleExpand = () => setExpanded(!expanded);

    return (
        <div className="portfolio-card" onClick={toggleExpand} style={{ cursor: 'pointer' }}>
            <div className="portfolio-header">
                <span className="ticker">{item.symbol}</span>
                <span className="type">{item.type || 'Stock'}</span>
            </div>
            <div className="portfolio-details">
                <div className="detail">
                    <div className="label">Volume</div>
                    <div className="value">{item.volume}</div>
                </div>
                <div className="detail">
                    <div className="label">Purchase Price</div>
                    <div className="value">{item.purchasePrice.toFixed(2)}</div>
                </div>
                <div className="detail">
                    <div className="label">Current Price</div>
                    <div className="value">{item.currentPrice.toFixed(2)}</div>
                </div>
                <div className="detail">
                    <div className="label">Unrealized P/L</div>
                    <div className={`value ${plColor(unrealizedPL)}`}>
                        {unrealizedPL.toFixed(2)}
                    </div>
                </div>
                <div className="detail">
                    <div className="label">Today P/L</div>
                    <div className={`value ${plColor(todayPL)}`}>
                        {todayPL.toFixed(2)}
                    </div>
                </div>
            </div>

            {/* 展开区域 */}
            {expanded && (
                <div className="summary-chart" style={{ marginTop: '1.5rem' }}>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={performanceData}>
                            <defs>
                                <linearGradient id={`lineGradient-${item.symbol}`} x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#9b1b4d" />
                                    <stop offset="50%" stopColor="#7a0c3e" />
                                    <stop offset="100%" stopColor="#9b1b4d" />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" stroke="#ff69b4" />
                            <YAxis stroke="#ff69b4" />
                            <Tooltip contentStyle={{ backgroundColor: '#111', border: 'none', color: '#fff' }} />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke={`url(#lineGradient-${item.symbol})`}
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#ff1493', stroke: '#fff', strokeWidth: 1 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}