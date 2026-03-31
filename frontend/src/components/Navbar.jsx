import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-logo">My Portfolio</div>
            <div className="navbar-links">
                <NavLink to="/portfolio" className={({ isActive }) => isActive ? "active" : ""}>Portfolio</NavLink>
                <NavLink to="/stocks" className={({ isActive }) => isActive ? "active" : ""}>Stocks</NavLink>
            </div>
        </nav>
    );
}