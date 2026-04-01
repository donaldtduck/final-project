import { useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

import {
    DndContext,
    closestCenter
} from '@dnd-kit/core';

import {
    SortableContext,
    arrayMove,
    useSortable,
    rectSortingStrategy
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

import './PortfolioSummary.css';


// ✅ 可拖拽卡片组件
function SortableCard({ id, label, value, className }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: 'grab'
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="summary-card"
        >
            <div className="label">{label}</div>
            <div className={`value ${className || ''}`}>{value}</div>
        </div>
    );
}


export default function PortfolioSummary({ summary, performanceData, pieData }) {
    const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

    // ✅ 8个指标（可拖拽）
    const [items, setItems] = useState([
        {
            id: 'totalValue',
            label: 'Total Value',
            render: () => `$${summary.totalValue.toFixed(2)}`
        },
        {
            id: 'totalCost',
            label: 'Total Cost',
            render: () => `$${summary.totalCost.toFixed(2)}`
        },
        {
            id: 'unrealized',
            label: 'Unrealized P/L',
            render: () => `$${summary.unrealizedPL.toFixed(2)}`,
            className: summary.unrealizedPL >= 0 ? 'green' : 'red'
        },
        {
            id: 'realized',
            label: 'Realized P/L',
            render: () => `$${summary.realizedPL.toFixed(2)}`
        },
        {
            id: 'return',
            label: 'Return',
            render: () => `${(summary.returnRate * 100).toFixed(2)}%`
        },
        {
            id: 'todayPL',
            label: 'Today P/L',
            render: () => `$${summary.todayPL.toFixed(2)}`,
            className: summary.todayPL >= 0 ? 'green' : 'red'
        },
        {
            id: 'todayChange',
            label: 'Today Change',
            render: () => `${(summary.todayChange * 100).toFixed(2)}%`,
            className: summary.todayChange >= 0 ? 'green' : 'red'
        },
        {
            id: 'holdings',
            label: 'Holdings',
            render: () => summary.holdings
        }
    ]);

    // ✅ 拖拽结束逻辑
    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over) return;

        if (active.id !== over.id) {
            const oldIndex = items.findIndex(i => i.id === active.id);
            const newIndex = items.findIndex(i => i.id === over.id);

            setItems(arrayMove(items, oldIndex, newIndex));
        }
    };

    return (
        <div className="portfolio-summary-container">

            {/* ✅ 可拖拽 8 个指标 */}
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext
                    items={items.map(i => i.id)}
                    strategy={rectSortingStrategy}
                >
                    <div
                        className="summary-cards"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(8, 1fr)',
                            gap: '1rem'
                        }}
                    >
                        {items.map(item => (
                            <SortableCard
                                key={item.id}
                                id={item.id}
                                label={item.label}
                                value={item.render()}
                                className={item.className}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {/* 图表区域 */}
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
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#222',
                                border: 'none',
                                color: '#fff',
                                boxShadow: '0 4px 12px rgba(218,112,214,0.5)'
                            }}
                        />
                        <Legend wrapperStyle={{ color: '#fff', fontSize: '0.8rem' }} />
                    </PieChart>
                </div>

            </div>
        </div>
    );
}