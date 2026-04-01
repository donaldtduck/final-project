import { useState, useEffect, useRef } from 'react';
import './PortfolioItem.css';
import { getStockPerformance } from '../api/portfolio';

export default function PortfolioItem({ item }) {
    const [expanded, setExpanded] = useState(false);
    const chartRef = useRef(null);

    const [unit, setUnit] = useState('DAY');
    const [slice, setSlice] = useState(30);
    const [tooltip, setTooltip] = useState(null); // 悬浮提示

    const unrealizedPL = (item.currentPrice - item.purchasePrice) * item.volume;
    const todayPL = (item.currentPrice - (item.prevClose || item.currentPrice)) * item.volume;
    const plColor = (value) => (value >= 0 ? 'green' : 'red');

    const toggleExpand = () => setExpanded(!expanded);

    useEffect(() => {
        if (!expanded || !chartRef.current) return;

        const load = async () => {
            try {
                const data = await getStockPerformance(item.symbol, slice, unit);
                if (!data) return;

                const canvas = chartRef.current;
                const ctx = canvas.getContext('2d');
                const width = canvas.width;
                const height = canvas.height;

                ctx.clearRect(0, 0, width, height);
                ctx.fillStyle = '#1b001b';
                ctx.fillRect(0, 0, width, height);

                const k = data.stockHistoryVoList;
                const trans = data.transactionVoList || [];
                if (k.length === 0) return;

                const padding = 40;
                const plotW = width - padding * 2;
                const plotH = height - padding * 2;
                const count = k.length;
                const gap = plotW / count;
                const barW = gap * 0.6;

                const allPrices = k.flatMap(x => [x.high, x.low, x.open, x.close]);
                const minP = Math.min(...allPrices);
                const maxP = Math.max(...allPrices);
                const priceRange = maxP - minP || 1;

                const x = (i) => padding + i * gap + gap / 2;
                const y = (p) => height - padding - (p - minP) / priceRange * plotH;

                // 网格
                ctx.strokeStyle = 'rgba(255, 105, 180, 0.25)';
                ctx.lineWidth = 1;
                for (let i = 0; i <= 5; i++) {
                    const cy = padding + (plotH / 5) * i;
                    ctx.beginPath();
                    ctx.moveTo(padding, cy);
                    ctx.lineTo(width - padding, cy);
                    ctx.stroke();
                }
                k.forEach((_, i) => {
                    const cx = x(i);
                    ctx.beginPath();
                    ctx.moveTo(cx, padding);
                    ctx.lineTo(cx, height - padding);
                    ctx.stroke();
                });

                // 坐标轴
                ctx.strokeStyle = '#ff69b4';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(padding, padding);
                ctx.lineTo(padding, height - padding);
                ctx.lineTo(width - padding, height - padding);
                ctx.stroke();

                // K线
                k.forEach((h, i) => {
                    const cx = x(i);
                    const oy = y(h.open);
                    const cy = y(h.close);
                    const hy = y(h.high);
                    const ly = y(h.low);
                    const green = h.close >= h.open;

                    ctx.strokeStyle = green ? '#00ff88' : '#ff4d6d';
                    ctx.fillStyle = green ? '#00ff88' : '#ff4d6d';
                    ctx.beginPath();
                    ctx.moveTo(cx, hy);
                    ctx.lineTo(cx, ly);
                    ctx.stroke();

                    const top = Math.min(oy, cy);
                    const hh = Math.abs(cy - oy) || 1;
                    ctx.fillRect(cx - barW / 2, top, barW, hh);
                });

                // ======================
                // 买卖点 + 垂直虚线
                // ======================
                // ======================
                // 买卖点 + 垂直虚线
                // ======================
                const tradePoints = [];

                trans.forEach((t) => {
                    const day = t.date.split('T')[0];
                    let idx = k.findIndex(item => item.day === day);

                    // 只有周线/月线匹配不到时，才找最近K线
                    if (idx === -1 && (unit === 'WEEK' || unit === 'MONTH')) {
                        for (let i = 0; i < k.length; i++) {
                            if (k[i].day <= day) {
                                idx = i;
                            } else {
                                break;
                            }
                        }
                    }

                    if (idx === -1) return;

                    const cx = x(idx);
                    const cy = y(t.price);
                    const isBuy = t.quantity > 0;
                    const lineColor = isBuy ? '#00f8ff' : '#ffde59';

                    ctx.setLineDash([4, 4]);
                    ctx.strokeStyle = lineColor;
                    ctx.beginPath();
                    ctx.moveTo(cx, cy);
                    ctx.lineTo(cx, isBuy ? height - padding : padding);
                    ctx.stroke();
                    ctx.setLineDash([]);

                    ctx.beginPath();
                    ctx.arc(cx, cy, 7, 0, Math.PI * 2);
                    ctx.fillStyle = lineColor;
                    ctx.fill();
                    ctx.strokeStyle = '#fff';
                    ctx.stroke();

                    tradePoints.push({ cx, cy, r: 12, t, day, isBuy });
                });

                // 👇 👇 👇 【关键：把鼠标事件写到这里，百分百能触发！】
                chartRef.current.onmousemove = (e) => {
                    const rect = chartRef.current.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    for (const p of tradePoints) {
                        const d = Math.hypot(x - p.cx, y - p.cy);
                        if (d < p.r) {
                            setTooltip({
                                x: e.clientX,
                                y: e.clientY,
                                content: (
                                    <div style={{ color: '#fff', fontSize: 13, lineHeight: 1.5 }}>
                                        <div>{p.isBuy ? '📈 买入' : '📉 卖出'}</div>
                                        <div>价格：{p.t.price.toFixed(2)}</div>
                                        <div>数量：{Math.abs(p.t.quantity).toFixed(2)}</div>
                                        <div>日期：{p.day}</div>
                                    </div>
                                )
                            });
                            return;
                        }
                    }
                    setTooltip(null);
                };

                chartRef.current.onmouseleave = () => setTooltip(null);

                // 轴文字
                ctx.fillStyle = '#ff69b4';
                ctx.font = '11px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(k[0]?.day, padding, height - 10);
                ctx.fillText(k.at(-1)?.day, width - padding, height - 10);

                ctx.textAlign = 'left';
                ctx.fillText(minP.toFixed(2), 6, height - padding + 5);
                ctx.fillText(maxP.toFixed(2), 6, padding + 10);

            } catch (err) {
                console.error('图表错误', err);
            }
        };

        load();
    }, [expanded, item.symbol, slice, unit]);

    return (
        <div className="portfolio-card" onClick={toggleExpand} style={{ cursor: 'pointer' }}>
            <div className="portfolio-header">
                <span className="ticker">{item.symbol}</span>
                <span className="type">Stock</span>
            </div>

            <div className="portfolio-details">
                <div className="detail">
                    <div className="label">Volume</div>
                    <div className="value">{item.volume}</div>
                </div>
                <div className="detail">
                    <div className="label">Purchase Price</div>
                    <div className="value">{Number(item.purchasePrice).toFixed(2)}</div>
                </div>
                <div className="detail">
                    <div className="label">Current Price</div>
                    <div className="value">{Number(item.currentPrice).toFixed(2)}</div>
                </div>
                <div className="detail">
                    <div className="label">Unrealized P/L</div>
                    <div className={`value ${plColor(unrealizedPL)}`}>
                        {Number(unrealizedPL).toFixed(2)}
                    </div>
                </div>
                <div className="detail">
                    <div className="label">Today P/L</div>
                    <div className={`value ${plColor(todayPL)}`}>
                        {Number(todayPL).toFixed(2)}
                    </div>
                </div>
            </div>

            {expanded && (
                <div style={{ marginTop: '1rem', position: 'relative' }}>
                    <div style={{
                        display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap'
                    }}>
                        <select
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                padding: '6px 12px', backgroundColor: '#222', color: '#fff',
                                border: '1px solid #ff69b4', borderRadius: '8px', outline: 'none'
                            }}
                        >
                            <option value="DAY">日线 DAY</option>
                            <option value="WEEK">周线 WEEK</option>
                            <option value="MONTH">月线 MONTH</option>
                        </select>

                        <select
                            value={slice}
                            onChange={(e) => setSlice(Number(e.target.value))}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                padding: '6px 12px', backgroundColor: '#222', color: '#fff',
                                border: '1px solid #ff69b4', borderRadius: '8px', outline: 'none'
                            }}
                        >
                            <option value={10}>10 周期</option>
                            <option value={30}>30 周期</option>
                            <option value={60}>60 周期</option>
                            <option value={90}>90 周期</option>
                            <option value={120}>120 周期</option>
                        </select>
                    </div>

                    <canvas
                        ref={chartRef}
                        width={600}
                        height={280}
                        style={{
                            width: '100%', height: '280px', borderRadius: '10px',
                            backgroundColor: '#1b001b', display: 'block'
                        }}
                    />

                    {/* 悬浮提示框 —— 绝对能看见 */}
                    {tooltip && (
                        <div
                            style={{
                                position: 'fixed',
                                left: tooltip.x + 10,
                                top: tooltip.y + 10,
                                background: '#111',
                                border: '1px solid #ff69b4',
                                borderRadius: 8,
                                padding: '8px 12px',
                                zIndex: 999999,
                                pointerEvents: 'none',
                            }}
                        >
                            {tooltip.content}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}