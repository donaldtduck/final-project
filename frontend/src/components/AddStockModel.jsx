import { useState } from 'react';
import { addPortfolioItem } from '../api/portfolio';

export default function AddStockModal({ onClose, onSuccess }) {
    const [symbol, setSymbol] = useState('');
    const [totalPrice, setTotalPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [date, setDate] = useState('');

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

        const res = await addPortfolioItem(dto);

        if (res) {
            onSuccess(res.data || res);
            onClose();
        }
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h2 style={titleStyle}>Add Stock</h2>

                {/* Symbol */}
                <input
                    placeholder="Symbol (e.g. AAPL)"
                    value={symbol}
                    onChange={e => setSymbol(e.target.value.toUpperCase())}
                    style={inputStyle}
                />

                {/* 二选一区域 */}
                <div style={{ display: 'flex', gap: '1rem' }}>
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
                            opacity: quantity ? 0.5 : 1
                        }}
                    />

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

/* ===== 样式 ===== */

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
    width: '420px',          // ⭐ 更大
    boxShadow:
        '0 10px 30px rgba(155,27,77,0.6), 0 0 20px rgba(218,112,214,0.2) inset',
};

const titleStyle = {
    color: '#ffc0f5',
    textAlign: 'center',
    textShadow:
        '0 0 6px rgba(255,192,245,0.6), 0 0 12px rgba(255,192,245,0.4)',
};

const inputStyle = {
    padding: '0.6rem 1rem',
    borderRadius: '8px',
    border: 'none',
    outline: 'none',
    fontSize: '0.95rem',
    background: 'linear-gradient(145deg, #030d2f, #1b0966)',
    color: '#fff',
    boxShadow:
        '0 4px 12px rgba(218,112,214,0.4), 0 0 10px rgba(238,130,238,0.2) inset',
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