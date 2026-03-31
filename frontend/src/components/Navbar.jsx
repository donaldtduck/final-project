import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import './Navbar.css';
import AddStockModal from './AddStockModel';

export default function Navbar({ onAddSuccess }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <nav className="navbar">
                <div className="navbar-logo">My Portfolio</div>

                <div className="navbar-links">
                    <NavLink to="/portfolio" className={({ isActive }) => isActive ? "active" : ""}>
                        Portfolio
                    </NavLink>
                    <NavLink to="/stocks" className={({ isActive }) => isActive ? "active" : ""}>
                        Stocks
                    </NavLink>
                </div>

                {/* 新增按钮 */}
                <button className="add-btn" onClick={() => setOpen(true)}>
                    + Add Item
                </button>
            </nav>

            {/* 弹窗 */}
            {open && (
                <AddStockModal
                    onClose={() => setOpen(false)}
                    onSuccess={onAddSuccess}
                />
            )}
        </>
    );
}