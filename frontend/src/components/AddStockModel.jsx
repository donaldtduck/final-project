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
            onSuccess(res);
            onClose();
        }
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h2 style={{ color: '#ffc0f5' }}>Add Stock</h2>

                <input placeholder="Symbol" value={symbol} onChange={e => setSymbol(e.target.value)} />

                <input placeholder="Total Price (optional)" value={totalPrice} onChange={e => setTotalPrice(e.target.value)} />

                <input placeholder="Quantity (optional)" value={quantity} onChange={e => setQuantity(e.target.value)} />

                <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} />

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={handleSubmit}>Submit</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
};

const modalStyle = {
    background: 'linear-gradient(145deg, #1b001b, #30021c)',
    padding: '2rem',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    minWidth: '300px',
};