import { useEffect, useState } from 'react';
import { analyticsAPI } from '../services/api';
import Navbar from '../components/common/Navbar';
import StatCard from '../components/analytics/StatCard';
import RevenueChart from '../components/analytics/RevenueChart';
import Loading from '../components/common/Loading';
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState(null);
    const [revenueData, setRevenueData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            try {
                const [analyticsRes, revenueRes] = await Promise.all([
                    analyticsAPI.getDashboard(),
                    analyticsAPI.getRevenue(30),
                ]);
                setAnalytics(analyticsRes.data.data);
                setRevenueData(revenueRes.data.data);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <BarChart3 className="text-primary" size={32} />
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800">Analytics</h1>
                        <p className="text-gray-600">Restaurant performance overview</p>
                    </div>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Revenue"
                        value={`£${analytics?.totalRevenue?.toFixed(2) || '0'}`}
                        icon={DollarSign}
                        color="primary"
                    />
                    <StatCard
                        title="Total Orders"
                        value={analytics?.totalOrders || 0}
                        icon={Users}
                        color="success"
                    />
                    <StatCard
                        title="Average Order"
                        value={`£${analytics?.averageOrderValue?.toFixed(2) || '0'}`}
                        icon={TrendingUp}
                        color="warning"
                    />
                    <StatCard
                        title="Top Item"
                        value={analytics?.topItems?.[0]?.item_name || 'N/A'}
                        icon={BarChart3}
                        color="secondary"
                    />
                </div>

                {/* Revenue Chart */}
                <RevenueChart data={revenueData} />

                {/* Top Items */}
                <div className="card p-6 mt-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Top 10 Items</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {analytics?.topItems?.slice(0, 10).map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl font-bold text-primary">{idx + 1}</span>
                                    <span className="font-semibold text-gray-800">{item.item_name}</span>
                                </div>
                                <span className="badge badge-primary">{item.count} orders</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}