import { Link } from 'react-router-dom';
import './Navigation.css';

export default function Navigation() {
    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    🍽️ BitePlate
                </Link>
                <ul className="nav-menu">
                    <li><Link to="/dashboard">Dashboard</Link></li>
                    <li><Link to="/tables">Tables</Link></li>
                    <li><Link to="/menu">Menu</Link></li>
                    <li><Link to="/kitchen">Kitchen</Link></li>
                    <li><Link to="/billing">Billing</Link></li>
                    <li><Link to="/analytics">Analytics</Link></li>
                </ul>
            </div>
        </nav>
    );
}