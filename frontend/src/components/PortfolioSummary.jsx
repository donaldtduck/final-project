import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './PortfolioSummary.css';

function SortableCard({ id, label, value, className }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition, cursor: 'grab' };
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="summary-card">
            <div className="label">{label}</div>
            <div className={`value ${className || ''}`}>{value}</div>
        </div>
    );
}

// 👇 接收 props，不再自己加载
export default function PortfolioSummary({ overview, holdings, chartData }) {
    const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
    const [items, setItems] = useState([
        { id: 'totalValue', label: 'Total Value' },
        { id: 'totalCost', label: 'Total Cost' },
        { id: 'unrealized', label: 'Unrealized P/L' },
        { id: 'realized', label: 'Realized P/L' },
        { id: 'return', label: 'Return' },
        { id: 'todayPL', label: 'Today P/L' },
        { id: 'todayChange', label: 'Today Change' },
        { id: 'holdings', label: 'Holdings' },
    ]);

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over) return;
        if (active.id !== over.id) {
            const oldIndex = items.findIndex(i => i.id === active.id);
            const newIndex = items.findIndex(i => i.id === over.id);
            setItems(arrayMove(items, oldIndex, newIndex));
        }
    };

    const getRate = (symbol) => {
        const s = symbol.toLowerCase();
        if (s.startsWith('sh') || s.startsWith('sz')) return 0.14;
        if (s.startsWith('hk')) return 0.128;
        return 1.0;
    };

    // 👇 饼图直接用传入的 holdings
    const pieData = holdings.map(item => {
        const totalValue = item.currentPrice * item.volume;
        const rate = getRate(item.symbol);
        const usdValue = totalValue * rate;
        return { name: item.symbol, value: usdValue };
    });

    const getCardContent = (id) => {
        switch (id) {
            case 'totalValue': return { value: `$${Number(overview.totalValue).toFixed(2)}` };
            case 'totalCost': return { value: `$${Number(overview.totalCost).toFixed(2)}` };
            case 'unrealized':
                return {
                    value: `$${Number(overview.unrealizedPnl).toFixed(2)}`,
                    className: Number(overview.unrealizedPnl) >= 0 ? 'green' : 'red'
                };
            case 'realized':
                return {
                    value: `$${Number(overview.realizedPnl).toFixed(2)}`,
                    className: Number(overview.realizedPnl) >= 0 ? 'green' : 'red'
                };
            case 'return':
                return {
                    value: `${Number(overview.returnRate).toFixed(2)}%`,
                    className: Number(overview.returnRate) >= 0 ? 'green' : 'red'
                };
            case 'todayPL':
                return {
                    value: `$${Number(overview.todayPnl).toFixed(2)}`,
                    className: Number(overview.todayPnl) >= 0 ? 'green' : 'red'
                };
            case 'todayChange':
                return {
                    value: `${Number(overview.todayChange).toFixed(2)}%`,
                    className: Number(overview.todayChange) >= 0 ? 'green' : 'red'
                };
            case 'holdings': return { value: overview.totalHoldings };
            default: return { value: '' };
        }
    };

    return (
        <div className="portfolio-summary-container">
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={items.map(i => i.id)} strategy={rectSortingStrategy}>
                    <div className="summary-cards" style={{ gridTemplateColumns: 'repeat(8, 1fr)', gap: '1rem' }}>
                        {items.map(item => {
                            const c = getCardContent(item.id);
                            return <SortableCard key={item.id} id={item.id} label={item.label} value={c.value} className={c.className} />;
                        })}
                    </div>
                </SortableContext>
            </DndContext>

            <div className="summary-charts-container">
                <div className="line-chart-wrapper">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
                            <defs>
                                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#9b1b4d" />
                                    <stop offset="50%" stopColor="#7a0c3e" />
                                    <stop offset="100%" stopColor="#9b1b4d" />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" stroke="#ff69b4" tickLine={false} axisLine={{ stroke: '#ff69b4' }} />
                            <YAxis stroke="#ff69b4" tickLine={false} axisLine={{ stroke: '#ff69b4' }} />
                            <Tooltip contentStyle={{ backgroundColor: '#222', border: 'none', color: '#fff' }} />
                            <Line type="monotone" dataKey="value" stroke="url(#lineGradient)" strokeWidth={3} dot={{ r: 4, fill: '#ff1493', stroke: '#fff' }} />
                            <Line type="monotone" dataKey="cost" stroke="#aaa" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

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
                            innerRadius={50}
                            labelLine={false}
                            label={({ percent }) => <tspan fill="white" fontSize="13" fontWeight="bold">{(percent * 100).toFixed(0)}%</tspan>}
                        >
                            {pieData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#222', border: 'none', color: '#fff' }}
                            formatter={(value, _name, props) => {
                                const total = pieData.reduce((sum, item) => sum + item.value, 0);
                                const pct = ((value / total) * 100).toFixed(0);
                                return [`$${value.toFixed(2)} | ${pct}%`, props.payload.name];
                            }}
                        />
                        <Legend wrapperStyle={{ color: '#fff', fontSize: '0.8rem' }} />
                    </PieChart>
                </div>
            </div>
        </div>
    );
}