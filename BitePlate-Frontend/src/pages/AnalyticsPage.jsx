import { useEffect, useState } from 'react';
import { ordersAPI } from '../services/api';

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await ordersAPI.getHistory();
                setAnalytics(response.data.data);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="analytics-page">
            <h1>Analytics Dashboard</h1>

            {analytics && (
                <>
                    <div className="analytics-grid">
                        <div className="analytics-card">
                            <h3>Total Revenue</h3>
                            <p className="big-number">
                                £{parseFloat(analytics.totalRevenue || 0).toFixed(2)}
                            </p>
                        </div>

                        <div className="analytics-card">
                            <h3>Top Ordered Items</h3>
                            <ul>
                                {analytics.topItems.map((item, idx) => (
                                    <li key={idx}>
                                        {item.item_name} - {item.count} orders
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="analytics-card">
                            <h3>Peak Hours</h3>
                            <ul>
                                {analytics.peakHours.map((hour, idx) => (
                                    <li key={idx}>
                                        {hour.hour}:00 - {hour.count} orders
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}