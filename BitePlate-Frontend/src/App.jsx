import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import MenuPage from './pages/MenuPage';
import BillingPage from './pages/BillingPage';
import AnalyticsPage from './pages/AnalyticsPage';
import './App.css';

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Routes>
    </Router>
  );
}

export default App;