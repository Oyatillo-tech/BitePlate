import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { tablesAPI, analyticsAPI } from '../services/api';
import Navbar from '../components/common/Navbar';
import TableGrid from '../components/table/TableGrid';
import StatCard from '../components/analytics/StatCard';
import Loading from '../components/common/Loading';
import { Users, Utensils, TrendingUp, DollarSign } from 'lucide-react';

export default function Dashboard() {
    const tables = useAppStore((state) => state.tables);
    const setTables = useAppStore((state) => state.setTables);
    const analytics = useAppStore((state) => state.analytics);
    const setAnalytics = useAppStore((state) => state.setAnalytics);
    const loading = useAppStore((state) => state.loading);
    const setLoading = useAppStore((state) => state.setLoading);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [tablesRes, analyticsRes] = await Promise.all([
                    tablesAPI.getAll(),
                    analyticsAPI.getDashboard(),
                ]);
                setTables(tablesRes.data.data);
                setAnalytics(analyticsRes.data.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <Loading />;

    const occupied = tables.filter(t => t.status === 'OCCUPIED').length;
    const free = tables.filter(t => t.status === 'FREE').length;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
                    <p className="text-gray-600">Welcome back! Here's your restaurant overview.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Tables"
                        value={tables.length}
                        icon={Users}
                        color="primary"
                    />
                    <StatCard
                        title="Tables Occupied"
                        value={occupied}
                        icon={Utensils}
                        color="warning"
                    />
                    <StatCard
                        title="Available Tables"
                        value={free}
                        icon={Users}
                        color="success"
                    />
                    <StatCard
                        title="Today's Revenue"
                        value={`£${analytics?.totalRevenue?.toFixed(2) || '0'}`}
                        icon={DollarSign}
                        color="primary"
                    />
                </div>

                {/* Tables Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Floor Plan</h2>
                    <TableGrid tables={tables} />
                </div>
            </div>
        </div>
    );
}