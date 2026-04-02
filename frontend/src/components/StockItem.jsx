import { useState, useEffect, useRef } from 'react';
import { getStockPerformance, unsubscribeStock } from '../api/portfolio';

const CNY = '¥';
const HKD = 'HK$';
const USD = '$';

export default function StockItem({ stock, onDelete }) {
    const chartRef = useRef(null);
    const [expanded, setExpanded] = useState(false);
    const [unit, setUnit] = useState('DAY');
    const [slice, setSlice] = useState(30);

    const getCurrency = () => {
        const s = stock.symbol.toLowerCase();
        if (s.startsWith('sh') || s.startsWith('sz')) return CNY;
        if (s.startsWith('hk')) return HKD;
        return USD;
    };

    const currency = getCurrency();
    const change = Number(stock.priceChangeRate || 0);
    const color = change >= 0 ? '#00ff88' : '#ff4d6d';

    const toggle = (e) => {
        e.stopPropagation();
        setExpanded(!expanded);
    };

    const stop = (e) => e.stopPropagation();

    const handleUnsubscribe = async (e) => {
        e.stopPropagation();
        if (!confirm('Confirm unsubscribe ' + stock.symbol + '?')) return;

        try {
            const success = await unsubscribeStock(stock.symbol);
            if (success) {
                alert('Unsubscribe success!');
                if (onDelete) onDelete(stock.symbol);
            } else {
                alert('Unsubscribe failed: server error');
            }
        } catch (err) {
            console.error(err);
            alert('Unsubscribe failed: network error');
        }
    };

    useEffect(() => {
        if (!expanded || !chartRef.current) return;
        const load = async () => {
            const data = await getStockPerformance(stock.symbol, slice, unit);
            if (!data || !data.stockHistoryVoList) return;

            const canvas = chartRef.current;
            const ctx = canvas.getContext('2d');
            const w = canvas.width;
            const h = canvas.height; // 🔥 修复这里！

            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = '#1b001b';
            ctx.fillRect(0, 0, w, h);

            const k = data.stockHistoryVoList;
            const pad = 50;
            const pw = w - pad * 2;
            const ph = h - pad * 2;
            const n = k.length;
            const gap = pw / n;
            const barW = gap * 0.6;

            const all = k.flatMap(x => [x.high, x.low, x.open, x.close]);
            const min = Math.min(...all);
            const max = Math.max(...all);
            const rng = max - min || 1;

            const x = i => pad + i * gap + gap / 2;
            const y = p => h - pad - (p - min) / rng * ph;

            // 网格
            ctx.strokeStyle = 'rgba(255,105,180,0.15)';
            ctx.lineWidth = 1;
            for (let i = 0; i <= 5; i++) {
                const cy = pad + (ph / 5) * i;
                ctx.beginPath();
                ctx.moveTo(pad, cy);
                ctx.lineTo(w - pad, cy);
                ctx.stroke();
            }

            // K线
            k.forEach((c, i) => {
                const cx = x(i);
                const green = c.close >= c.open;
                ctx.strokeStyle = green ? '#00ff88' : '#ff4d6d';
                ctx.fillStyle = green ? '#00ff88' : '#ff4d6d';

                ctx.beginPath();
                ctx.moveTo(cx, y(c.high));
                ctx.lineTo(cx, y(c.low));
                ctx.stroke();

                const t = Math.min(y(c.open), y(c.close));
                const ht = Math.abs(y(c.close) - y(c.open)) || 1;
                ctx.fillRect(cx - barW / 2, t, barW, ht);
            });

            // 纵轴价格
            ctx.fillStyle = '#ffb6e6';
            ctx.font = '12px Arial';
            ctx.textAlign = 'right';
            for (let i = 0; i <= 4; i++) {
                const price = min + (rng * i) / 4;
                const cy = pad + ph - (ph * i) / 4;
                ctx.fillText(price.toFixed(2), pad - 6, cy + 4);
            }

            // 横轴周期
            ctx.textAlign = 'center';
            const step = Math.max(1, Math.floor(n / 6));
            for (let i = 0; i < n; i += step) {
                const cx = x(i);
                const label = unit === 'DAY' ? i + 1 : unit === 'WEEK' ? 'W' + i : 'M' + i;
                ctx.fillText(label, cx, h - pad + 15);
            }

            // 外框
            ctx.strokeStyle = '#ff69b4';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(pad, pad);
            ctx.lineTo(pad, h - pad);
            ctx.lineTo(w - pad, h - pad);
            ctx.lineTo(w - pad, pad);
            ctx.stroke();

        };
        load();
    }, [expanded, slice, unit]);

    return (
        <div
            className="portfolio-card"
            onClick={toggle}
            style={{
                background: 'linear-gradient(145deg, #1b001b, #30021c)',
                borderRadius: '16px',
                padding: '1.2rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(155,27,77,0.4)',
                color: '#fff',
            }}
        >
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem'
            }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', flex: 1 }}>
                    {stock.symbol}
                </div>

                <div style={{ color, fontSize: '16px', flexShrink: 0 }}>
                    {currency}{Number(stock.currentPrice).toFixed(2)}
                    {' '}
                    ({change >= 0 ? '+' : ''}{change.toFixed(2)}%)
                </div>

                <button
                    onClick={handleUnsubscribe}
                    style={{
                        padding: '0.3rem 0.7rem',
                        fontSize: '18px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#444',
                        color: '#ff88a8',
                        cursor: 'pointer',
                        flexShrink: 0
                    }}
                >
                    Unsubscribe
                </button>
            </div>

            {expanded && (
                <div onClick={stop} style={{ marginTop: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.7rem', marginBottom: '0.7rem' }}>
                        <select
                            value={unit}
                            onClick={stop}
                            onChange={(e) => { stop(e); setUnit(e.target.value); }}
                            style={{
                                padding: '6px 10px',
                                backgroundColor: '#222',
                                color: '#fff',
                                border: '1px solid #ff69b4',
                                borderRadius: 8,
                                outline: 'none',
                            }}
                        >
                            <option>DAY</option>
                            <option>WEEK</option>
                            <option>MONTH</option>
                        </select>
                        <select
                            value={slice}
                            onClick={stop}
                            onChange={(e) => { stop(e); setSlice(Number(e.target.value)); }}
                            style={{
                                padding: '6px 10px',
                                backgroundColor: '#222',
                                color: '#fff',
                                border: '1px solid #ff69b4',
                                borderRadius: 8,
                                outline: 'none',
                            }}
                        >
                            <option value={10}>10</option>
                            <option value={30}>30</option>
                            <option value={60}>60</option>
                            <option value={90}>90</option>
                        </select>
                    </div>

                    <canvas
                        ref={chartRef}
                        width={600}
                        height={280}
                        style={{
                            width: '100%',
                            height: 280,
                            borderRadius: 10,
                            backgroundColor: '#1b001b',
                        }}
                    />
                </div>
            )}
        </div>
    );
}