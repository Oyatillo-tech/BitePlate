import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { getNavItemsForRole } from '../../utils/roles';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = user ? getNavItemsForRole(user.role) : [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2.5 text-primary">
            <span className="text-lg">🍽️</span>
            <span className="text-base font-semibold tracking-tight">BitePlate</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? 'bg-primary text-white'
                      : 'text-secondary hover:text-primary hover:bg-muted'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-primary leading-none">{user?.name}</p>
              <p className="text-xs text-secondary mt-0.5">{user?.role}</p>
            </div>
            <button onClick={handleLogout} className="btn-ghost !px-2 !py-2" aria-label="Logout">
              <LogOut size={18} />
            </button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden btn-ghost !px-2 !py-2"
            aria-label="Menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden border-t border-border py-3 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === item.path
                    ? 'bg-primary text-white'
                    : 'text-secondary hover:bg-muted'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-secondary hover:bg-muted"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
