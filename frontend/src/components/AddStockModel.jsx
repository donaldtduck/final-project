import { useState, useEffect } from 'react';
import { addPortfolioItem } from '../api/portfolio';

export default function AddStockModal({ onClose, onSuccess }) {
    const [symbol, setSymbol] = useState('');
    const [totalPrice, setTotalPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [date, setDate] = useState('');

    // —————————————————— 🔥 自动识别货币符号 ——————————————————
    const getCurrencySymbol = () => {
        const s = symbol.trim().toLowerCase();
        if (s.startsWith("sh") || s.startsWith("sz")) {
            return "¥";      // A股
        } else if (s.startsWith("hk") || s.match(/^\d{5}$/) || s.startsWith("0")) {
            return "HK$";    // 港股
        } else {
            return "$";      // 美股
        }
    };

    const currency = getCurrencySymbol();

    // —————————————————— 提交逻辑 ——————————————————
    const handleSubmit = async () => {
        if (!symbol) return alert('Symbol required');
        if (!totalPrice && !quantity) {
            return alert('Fill either totalPrice or quantity');
        }

        const dto = {
            symbol,
            totalPrice: totalPrice ? Number(totalPrice) : null,
            quantity: quantity ? Number(quantity) : null,
            date: date ? new Date(date).toISOString() : null,
        };

        try {
            await addPortfolioItem(dto);
            onSuccess();
            onClose();
            window.location.reload();
        } catch (err) {
            console.error('添加失败', err);
            alert('Add failed: ' + err.message);
        }
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h2 style={titleStyle}>Add Stock</h2>

                {/* Symbol */}
                <input
                    placeholder="Symbol (e.g. AAPL, SH600000)"
                    value={symbol}
                    onChange={e => setSymbol(e.target.value.toUpperCase())}
                    style={inputStyle}
                />

                {/* 二选一区域 */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {/* —————— 🔥 左边：货币符号 + Total Price —————— */}
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        position: 'relative'
                    }}>
                        {/* 货币符号固定在左侧 */}
                        <span style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#ffc0f5',
                            fontSize: '0.95rem',
                            pointerEvents: 'none'
                        }}>
                            {currency}
                        </span>

                        <input
                            placeholder="Total Price"
                            value={totalPrice}
                            disabled={!!quantity}
                            onChange={e => {
                                setTotalPrice(e.target.value);
                                if (e.target.value) setQuantity('');
                            }}
                            style={{
                                ...inputStyle,
                                paddingLeft: '32px', // 给符号留位置
                                opacity: quantity ? 0.5 : 1
                            }}
                        />
                    </div>

                    {/* Quantity */}
                    <input
                        placeholder="Quantity"
                        value={quantity}
                        disabled={!!totalPrice}
                        onChange={e => {
                            setQuantity(e.target.value);
                            if (e.target.value) setTotalPrice('');
                        }}
                        style={{
                            ...inputStyle,
                            opacity: totalPrice ? 0.5 : 1
                        }}
                    />
                </div>

                {/* Date */}
                <input
                    type="datetime-local"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    style={inputStyle}
                />

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button style={btnPrimary} onClick={handleSubmit}>
                        Submit
                    </button>
                    <button style={btnSecondary} onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ===== 样式 完全不变 ===== */
const overlayStyle = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.75)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
};

const modalStyle = {
    background: 'linear-gradient(145deg, #1b001b, #30021c)',
    padding: '2.5rem',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
    width: '420px',
    boxShadow: '0 10px 30px rgba(155,27,77,0.6), 0 0 20px rgba(218,112,214,0.2) inset',
};

const titleStyle = {
    color: '#ffc0f5',
    textAlign: 'center',
    textShadow: '0 0 6px rgba(255,192,245,0.6), 0 0 12px rgba(255,192,245,0.4)',
};

const inputStyle = {
    padding: '0.6rem 1rem',
    borderRadius: '8px',
    border: 'none',
    outline: 'none',
    fontSize: '0.95rem',
    background: 'linear-gradient(145deg, #030d2f, #1b0966)',
    color: '#fff',
    boxShadow: '0 4px 12px rgba(218,112,214,0.4), 0 0 10px rgba(238,130,238,0.2) inset',
    transition: 'all 0.3s ease',
};

const btnPrimary = {
    flex: 1,
    padding: '0.6rem',
    background: 'linear-gradient(145deg, #6e0b2c, #9b1b4d)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(155,27,77,0.6)',
};

const btnSecondary = {
    flex: 1,
    padding: '0.6rem',
    background: '#222',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
};