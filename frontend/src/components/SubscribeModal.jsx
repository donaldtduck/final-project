import { useState } from 'react';
import { subscribeStock } from '../api/portfolio';

export default function SubscribeModal({ onClose, onSuccess }) {
    const [symbol, setSymbol] = useState('');
    const [loading, setLoading] = useState(false);

    // 识别市场
    const getMarketType = () => {
        const s = symbol.trim().toLowerCase();
        if (s.startsWith("sh") || s.startsWith("sz")) {
            return "A Stock";
        } else if (s.startsWith("hk") || s.match(/^\d{5}$/) || s.startsWith("0")) {
            return "HK Stock";
        } else {
            return "US Stock";
        }
    };

    const market = getMarketType();

    // 提交订阅
    const handleSubmit = async () => {
        if (!symbol) {
            alert("Please enter a symbol");
            return;
        }

        setLoading(true);
        const res = await subscribeStock(symbol);

        if (res) {
            alert("Subscribe success!");
            onSuccess();
            onClose();
        } else {
            alert("Subscribe failed");
        }

        setLoading(false);
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h2 style={titleStyle}>Subscribe Stock</h2>

                {/* Symbol Input */}
                <input
                    placeholder="Symbol (e.g. AAPL, SH600000, HK00700)"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    style={inputStyle}
                />

                {/* Market Type Display */}
                <div style={{
                    padding: '0.6rem 1rem',
                    borderRadius: '8px',
                    background: '#1b0966',
                    color: '#ffc0f5',
                    fontSize: '0.95rem',
                    textAlign: 'center'
                }}>
                    Identified Market：{market}
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button
                        style={btnPrimary}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Confirm Subscribe'}
                    </button>
                    <button style={btnSecondary} onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

// 完全和你统一的样式
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