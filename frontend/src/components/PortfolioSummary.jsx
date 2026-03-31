import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './PortfolioSummary.css';

export default function PortfolioSummary({ summary, performanceData }) {
    return (
        <div className="portfolio-summary-container">
            {/* 卡片指标区域 */}
            <div className="summary-cards">
                <div className="summary-card">
                    <div className="label">Total Value</div>
                    <div className="value">${summary.totalValue.toFixed(2)}</div>
                </div>
                <div className="summary-card">
                    <div className="label">Total Cost</div>
                    <div className="value">${summary.totalCost.toFixed(2)}</div>
                </div>
                <div className="summary-card">
                    <div className="label">Unrealized P/L</div>
                    <div className={`value ${summary.unrealizedPL >= 0 ? 'green' : 'red'}`}>
                        ${summary.unrealizedPL.toFixed(2)}
                    </div>
                </div>
                <div className="summary-card">
                    <div className="label">Realized P/L</div>
                    <div className="value">${summary.realizedPL.toFixed(2)}</div>
                </div>
                <div className="summary-card">
                    <div className="label">Return</div>
                    <div className="value">{(summary.returnRate * 100).toFixed(2)}%</div>
                </div>
                <div className="summary-card">
                    <div className="label">Today P/L</div>
                    <div className={`value ${summary.todayPL >= 0 ? 'green' : 'red'}`}>
                        ${summary.todayPL.toFixed(2)}
                    </div>
                </div>
                <div className="summary-card">
                    <div className="label">Today Change</div>
                    <div className={`value ${summary.todayChange >= 0 ? 'green' : 'red'}`}>
                        {(summary.todayChange * 100).toFixed(2)}%
                    </div>
                </div>
                <div className="summary-card">
                    <div className="label">Holdings</div>
                    <div className="value">{summary.holdings}</div>
                </div>
            </div>

            {/* 折线图 */}
            <div className="summary-chart">
                <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={performanceData}>
                        <defs>
                            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
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
                            stroke="url(#lineGradient)"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#ff1493', stroke: '#fff', strokeWidth: 1 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}