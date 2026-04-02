import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import './Navbar.css';
import AddStockModal from './AddStockModel';
import SubscribeModal from './SubscribeModal';

export default function Navbar({ onAddSuccess }) {
    const [addOpen, setAddOpen] = useState(false);
    const [subOpen, setSubOpen] = useState(false);

    return (
        <>
            <nav className="navbar" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                padding: '1rem 1.5rem',
                background: '#161616',
                borderBottom: '1px solid #333',
                fontSize: '16px' /* 全局字体放大 */
            }}>
                {/* ========== 左侧：Logo + 导航 ========== */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
                    <div className="navbar-logo" style={{
                        fontSize: '20px', /* LOGO更大 */
                        fontWeight: 'bold',
                        color: '#ffc0f5'
                    }}>
                        My Portfolio
                    </div>

                    <div className="navbar-links" style={{ display: 'flex', gap: '1.8rem' }}>
                        <NavLink
                            to="/portfolio"
                            className={({ isActive }) => isActive ? 'active' : ''}
                            style={{
                                color: '#fff',
                                textDecoration: 'none',
                                fontSize: '16px' /* 导航字体放大 */
                            }}
                        >
                            Portfolio
                        </NavLink>
                        <NavLink
                            to="/stocks"
                            className={({ isActive }) => isActive ? 'active' : ''}
                            style={{
                                color: '#fff',
                                textDecoration: 'none',
                                fontSize: '16px' /* 导航字体放大 */
                            }}
                        >
                            Stocks
                        </NavLink>
                    </div>
                </div>

                {/* ========== 右侧：两个按钮 紧凑排列 ========== */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        className="add-btn"
                        onClick={() => setAddOpen(true)}
                        style={{
                            padding: '0.6rem 1.1rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'linear-gradient(145deg, #6e0b2c, #9b1b4d)',
                            color: '#fff',
                            cursor: 'pointer',
                            fontSize: '15px' /* 按钮字体更大 */
                        }}
                    >
                        + Add Item
                    </button>

                    <button
                        className="add-btn"
                        onClick={() => setSubOpen(true)}
                        style={{
                            padding: '0.6rem 1.1rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'linear-gradient(145deg, #1a5fb4, #2e78cc)',
                            color: '#fff',
                            cursor: 'pointer',
                            fontSize: '15px' /* 按钮字体更大 */
                        }}
                    >
                        + Subscribe
                    </button>
                </div>
            </nav>

            {addOpen && (
                <AddStockModal
                    onClose={() => setAddOpen(false)}
                    onSuccess={onAddSuccess}
                />
            )}

            {subOpen && (
                <SubscribeModal
                    onClose={() => setSubOpen(false)}
                    onSuccess={() => window.location.reload()}
                />
            )}
        </>
    );
}