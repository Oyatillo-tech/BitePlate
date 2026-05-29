import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { useAppStore } from '../../store/useAppStore';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Tables', path: '/tables' },
        { label: 'Menu', path: '/menu' },
        { label: 'Orders', path: '/orders' },
        { label: 'Billing', path: '/billing' },
        { label: 'Kitchen', path: '/kitchen' },
        { label: 'Analytics', path: '/analytics' },
        { label: 'Reservations', path: '/reservations' },
    ];

    return (
        <nav className="bg-gradient-to-r from-primary to-secondary shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/dashboard" className="flex items-center gap-2 text-white text-2xl font-bold">
                        <span>🍽️</span>
                        <span>BitePlate</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="text-white hover:text-yellow-300 transition-colors font-medium"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* User Info */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="flex items-center gap-2 text-white">
                            <User size={20} />
                            <span className="font-medium">{user?.name}</span>
                            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{user?.role}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-white"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden pb-4 space-y-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className="block text-white hover:text-yellow-300 transition-colors py-2 px-4 rounded-lg hover:bg-white/10"
                            >
                                {item.label}
                            </Link>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="w-full text-left text-white hover:text-yellow-300 py-2 px-4 rounded-lg hover:bg-white/10"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}