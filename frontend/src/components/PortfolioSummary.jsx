import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import './PortfolioSummary.css';

export default function PortfolioSummary({ summary, performanceData, pieData }) {
    const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

    return (
        <div className="portfolio-summary-container">
            {/* 8 个指标 */}
            <div className="summary-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '1rem' }}>
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

            {/* 图表区域：折线图 + 饼图 */}
            <div className="summary-charts-container">
                {/* 折线图 */}
                <div className="line-chart-wrapper">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={performanceData}
                            margin={{ top: 10, right: 20, left: 0, bottom: 30 }}
                        >
                            <defs>
                                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#9b1b4d" />
                                    <stop offset="50%" stopColor="#7a0c3e" />
                                    <stop offset="100%" stopColor="#9b1b4d" />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="date"
                                stroke="#ff69b4"
                                tickLine={false}
                                axisLine={{ stroke: '#ff69b4' }}
                                padding={{ left: 0, right: 0 }}
                            />
                            <YAxis
                                stroke="#ff69b4"
                                tickLine={false}
                                axisLine={{ stroke: '#ff69b4' }}
                                domain={['dataMin', 'dataMax']}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#222',
                                    border: 'none',
                                    color: '#fff',
                                    boxShadow: '0 4px 12px rgba(218,112,214,0.5)',
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="url(#lineGradient)"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#ff1493', stroke: '#fff', strokeWidth: 1 }}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* 饼图 */}
                <div className="pie-chart-wrapper">
                    <h3>Portfolio Share</h3>
                    <PieChart width={250} height={250}>
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label={{ fill: '#fff', fontSize: 12 }}
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#222', border: 'none', color: '#fff', boxShadow: '0 4px 12px rgba(218,112,214,0.5)' }} />
                        <Legend wrapperStyle={{ color: '#fff', fontSize: '0.8rem' }} />
                    </PieChart>
                </div>
            </div>
        </div>
    );
}