import { useState, useEffect, useRef } from 'react';
import './PortfolioItem.css';
import { getStockPerformance } from '../api/portfolio';

// 货币符号定义
const CNY_TO_USD = '¥';    // A股
const HKD_TO_USD = 'HK$'; // 港股
const USD_TO_USD = '$';   // 美股

// ✅ 移除股票接口
export async function removeStock(dto) {
    try {
        const res = await fetch('http://localhost:8080/api/stock/remove', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dto),
        });

        if (!res.ok) throw new Error('Remove failed');
        return await res.text();
    } catch (err) {
        console.error(err);
        return null;
    }
}

export default function PortfolioItem({ item }) {
    const chartRef = useRef(null);
    const [expanded, setExpanded] = useState(false);
    const [unit, setUnit] = useState('DAY');
    const [slice, setSlice] = useState(30);

    // Remove form
    const [quantity, setQuantity] = useState('');
    const [date, setDate] = useState('');
    const [msg, setMsg] = useState('');

    const plColor = (value) => (value >= 0 ? 'green' : 'red');

    // 根据股票代码获取货币符号
    const getCurrencySymbol = () => {
        const symbol = item.symbol.toLowerCase();
        if (symbol.startsWith("sh") || symbol.startsWith("sz")) {
            return CNY_TO_USD;
        } else if (symbol.startsWith("hk")) {
            return HKD_TO_USD;
        } else {
            return USD_TO_USD;
        }
    };

    // 直接在这里拿到当前货币符号
    const currency = getCurrencySymbol();

    const handleToggle = (e) => {
        e.stopPropagation();
        setExpanded(!expanded);
    };

    const stop = (e) => e.stopPropagation();

    // ✅ 提交移除 + 成功后刷新页面
    const handleSubmitRemove = async (e) => {
        e.stopPropagation();
        if (!quantity || !date) {
            setMsg('Please fill all fields');
            return;
        }
        const qty = Number(quantity);
        if (qty <= 0 || qty > item.volume) {
            setMsg('Quantity must be between 0 and ' + item.volume);
            return;
        }

        const dto = {
            symbol: item.symbol,
            date: date,
            quantity: qty,
        };

        const result = await removeStock(dto);
        if (result) {
            setMsg('Success!');
            setQuantity('');
            setDate('');

            // ✅ 操作完成后刷新页面，更新持仓
            setTimeout(() => window.location.reload(), 800);
        } else {
            setMsg('Failed');
        }
    };

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

                ctx.strokeStyle = '#ff69b4';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(padding, padding);
                ctx.lineTo(padding, height - padding);
                ctx.lineTo(width - padding, height - padding);
                ctx.stroke();

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

                trans.forEach((t) => {
                    const day = t.date.split('T')[0];
                    let idx = k.findIndex(item => item.day === day);

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
                });

                ctx.fillStyle = '#ff69b4';
                ctx.font = '11px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(k[0]?.day, padding, height - 10);
                ctx.fillText(k.at(-1)?.day, width - padding, height - 10);

                ctx.textAlign = 'left';
                ctx.fillText(minP.toFixed(2), 6, height - padding + 5);
                ctx.fillText(maxP.toFixed(2), 6, padding + 10);

            } catch (err) {
                console.error('Chart error', err);
            }
        };
        load();
    }, [expanded, item.symbol, slice, unit]);

    return (
        <div className="portfolio-card" onClick={handleToggle} style={{ cursor: 'pointer' }}>
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
                    <div className="label">Avg Price</div>
                    <div className="value">{currency}{Number(item.purchasePrice).toFixed(2)}</div>
                </div>
                <div className="detail">
                    <div className="label">Current</div>
                    <div className="value">{currency}{Number(item.currentPrice).toFixed(2)}</div>
                </div>
                <div className="detail">
                    <div className="label">Unrealized P/L</div>
                    <div className={`value ${plColor(item.unrealizedPnl)}`}>
                        {currency}{Number(item.unrealizedPnl).toFixed(2)}
                    </div>
                </div>
                <div className="detail">
                    <div className="label">Today P/L</div>
                    <div className={`value ${plColor(item.todayPnl)}`}>
                        {currency}{Number(item.todayPnl).toFixed(2)}
                    </div>
                </div>
            </div>

            {expanded && (
                <div onClick={stop} style={{ marginTop: '1rem' }}>

                    {/* ========== ✅ Chart ========== */}
                    <div style={{
                        display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap'
                    }}>
                        <select
                            value={unit}
                            onClick={stop}
                            onChange={(e) => { stop(e); setUnit(e.target.value); }}
                            style={{
                                padding: '6px 12px', backgroundColor: '#222', color: '#fff',
                                border: '1px solid #ff69b4', borderRadius: '8px', outline: 'none'
                            }}
                        >
                            <option value="DAY">Daily</option>
                            <option value="WEEK">Weekly</option>
                            <option value="MONTH">Monthly</option>
                        </select>

                        <select
                            value={slice}
                            onClick={stop}
                            onChange={(e) => { stop(e); setSlice(Number(e.target.value)); }}
                            style={{
                                padding: '6px 12px', backgroundColor: '#222', color: '#fff',
                                border: '1px solid #ff69b4', borderRadius: '8px', outline: 'none'
                            }}
                        >
                            <option value={10}>10 Periods</option>
                            <option value={30}>30 Periods</option>
                            <option value={60}>60 Periods</option>
                            <option value={90}>90 Periods</option>
                            <option value={120}>120 Periods</option>
                        </select>
                    </div>

                    <canvas
                        ref={chartRef}
                        width={800}
                        height={400}
                        onClick={stop}
                        style={{
                            width: '100%',
                            height: '280px',
                            borderRadius: '10px',
                            backgroundColor: '#1b001b',
                            display: 'block'
                        }}
                    />

                    {/* ========== ✅ Remove Stock Form 已移到图表下方 ========== */}
                    <div style={{
                        background: '#222',
                        borderRadius: '10px',
                        padding: '12px 14px',
                        marginTop: '1rem',
                        border: '1px solid #ff69b4'
                    }}>
                        <div style={{ fontSize: '14px', color: '#fff', marginBottom: '10px' }}>
                            Remove Stock
                        </div>

                        <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.6rem' }}>
                            <input
                                type="number"
                                placeholder="Quantity"
                                value={quantity}
                                onClick={stop}
                                onChange={(e) => {
                                    stop(e);
                                    setQuantity(e.target.value);
                                }}
                                style={{
                                    flex: 1,
                                    padding: '6px 10px',
                                    backgroundColor: '#111',
                                    color: '#fff',
                                    border: '1px solid #ff69b4',
                                    borderRadius: '8px',
                                    outline: 'none'
                                }}
                            />

                            <input
                                type="datetime-local"
                                value={date}
                                onClick={stop}
                                onChange={(e) => {
                                    stop(e);
                                    setDate(e.target.value);
                                }}
                                style={{
                                    flex: 1,
                                    padding: '6px 10px',
                                    backgroundColor: '#111',
                                    color: '#fff',
                                    border: '1px solid #ff69b4',
                                    borderRadius: '8px',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        <button
                            onClick={handleSubmitRemove}
                            style={{
                                width: '100%',
                                padding: '8px',
                                backgroundColor: '#ff4444',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            Confirm Remove
                        </button>

                        {msg && (
                            <div style={{
                                marginTop: '8px',
                                fontSize: '12px',
                                color: msg.includes('Success') ? '#0f0' : '#f33'
                            }}>
                                {msg}
                            </div>
                        )}
                    </div>

                </div>
            )}
        </div>
    );
}