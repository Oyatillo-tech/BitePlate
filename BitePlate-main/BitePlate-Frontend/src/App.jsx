import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import { canAccessRoute } from './utils/roles';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Dashboard from './pages/Dashboard';
import MenuPage from './pages/MenuPage';
import TablesPage from './pages/TablesPage';
import BillingPage from './pages/BillingPage';
import AnalyticsPage from './pages/AnalyticsPage';
import OrderPage from './pages/OrderPage';
import KitchenPage from './pages/KitchenPage';
import ReservationPage from './pages/ReservationPage';

function ProtectedRoute({ children, roles }) {
    const user = useAppStore((state) => state.user);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

function RoleRoute({ children, path }) {
    const user = useAppStore((state) => state.user);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!canAccessRoute(user.role, path)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

function App() {
    const user = useAppStore((state) => state.user);
    const setUser = useAppStore((state) => state.setUser);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, [setUser]);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <RoleRoute path="/dashboard"><Dashboard /></RoleRoute>
                    </ProtectedRoute>
                } />
                <Route path="/tables" element={
                    <ProtectedRoute>
                        <RoleRoute path="/tables"><TablesPage /></RoleRoute>
                    </ProtectedRoute>
                } />
                <Route path="/menu" element={
                    <ProtectedRoute>
                        <RoleRoute path="/menu"><MenuPage /></RoleRoute>
                    </ProtectedRoute>
                } />
                <Route path="/orders" element={
                    <ProtectedRoute>
                        <RoleRoute path="/orders"><OrderPage /></RoleRoute>
                    </ProtectedRoute>
                } />
                <Route path="/kitchen" element={
                    <ProtectedRoute>
                        <RoleRoute path="/kitchen"><KitchenPage /></RoleRoute>
                    </ProtectedRoute>
                } />
                <Route path="/billing" element={
                    <ProtectedRoute>
                        <RoleRoute path="/billing"><BillingPage /></RoleRoute>
                    </ProtectedRoute>
                } />
                <Route path="/analytics" element={
                    <ProtectedRoute>
                        <RoleRoute path="/analytics"><AnalyticsPage /></RoleRoute>
                    </ProtectedRoute>
                } />
                <Route path="/reservations" element={
                    <ProtectedRoute>
                        <RoleRoute path="/reservations"><ReservationPage /></RoleRoute>
                    </ProtectedRoute>
                } />

                <Route path="/" element={
                    user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
