import { useEffect, useState } from 'react';
import { analyticsAPI } from '../services/api';
import PageLayout from '../components/common/PageLayout';
import StatCard from '../components/analytics/StatCard';
import RevenueChart from '../components/analytics/RevenueChart';
import Loading from '../components/common/Loading';
import ErrorAlert from '../components/common/ErrorAlert';
import { BarChart3, TrendingUp, Users, DollarSign, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const CHART_COLORS = ['#18181b', '#52525b', '#a1a1aa', '#d4d4d8', '#71717a'];

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [staffData, setStaffData] = useState([]);
  const [peakHours, setPeakHours] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const [analyticsRes, revenueRes, staffRes, peakRes, paymentRes, tableRes] = await Promise.all([
          analyticsAPI.getDashboard(),
          analyticsAPI.getRevenue(30),
          analyticsAPI.getStaff(),
          analyticsAPI.getPeakHours(),
          analyticsAPI.getPaymentMethods(),
          analyticsAPI.getTables(),
        ]);
        setAnalytics(analyticsRes.data.data);
        setRevenueData(revenueRes.data.data || []);
        setStaffData(staffRes.data.data || []);
        setPeakHours(peakRes.data.data || []);
        setPaymentMethods(paymentRes.data.data || []);
        setTableData(tableRes.data.data || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <Loading />;

  const peakChartData = peakHours.map((h) => ({
    hour: `${h.hour}:00`,
    orders: parseInt(h.order_count || 0),
  }));

  const paymentChartData = paymentMethods.map((p) => ({
    name: p.payment_method || 'Unknown',
    value: parseFloat(p.total_revenue || 0),
  }));

  return (
    <PageLayout title="Analytics" subtitle="Restaurant performance overview" icon={BarChart3}>
      <ErrorAlert message={error} onClose={() => setError('')} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total revenue" value={`£${parseFloat(analytics?.totalRevenue || 0).toFixed(2)}`} icon={DollarSign} />
        <StatCard title="Total orders" value={analytics?.totalOrders || 0} icon={Users} />
        <StatCard title="Average order" value={`£${parseFloat(analytics?.averageOrderValue || 0).toFixed(2)}`} icon={TrendingUp} />
        <StatCard title="Top item" value={analytics?.topItems?.[0]?.item_name || 'N/A'} icon={BarChart3} />
      </div>

      <RevenueChart data={revenueData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <div className="card">
          <h3 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2">
            <Clock size={16} /> Peak hours
          </h3>
          {peakChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={peakChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#52525b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#52525b' }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e4e4e7', fontSize: 12 }} />
                <Bar dataKey="orders" fill="#18181b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-secondary text-center py-8 text-sm">No peak hour data</p>
          )}
        </div>

        <div className="card">
          <h3 className="text-sm font-semibold text-primary mb-4">Payment methods</h3>
          {paymentChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={paymentChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40}>
                  {paymentChartData.map((_, idx) => (
                    <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `£${parseFloat(v).toFixed(2)}`} contentStyle={{ borderRadius: 8, border: '1px solid #e4e4e7', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-secondary text-center py-8 text-sm">No payment data</p>
          )}
        </div>
      </div>

      {analytics?.topItems?.length > 0 && (
        <div className="card mt-4">
          <h3 className="text-sm font-semibold text-primary mb-4">Top items</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {analytics.topItems.slice(0, 10).map((item, idx) => (
              <div key={idx} className="flex justify-between items-center bg-muted rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-secondary w-5">{idx + 1}</span>
                  <span className="text-sm font-medium">{item.item_name}</span>
                </div>
                <span className="badge-primary">{item.count} orders</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {staffData.length > 0 && (
        <div className="card mt-4 overflow-hidden">
          <h3 className="text-sm font-semibold text-primary mb-4">Staff performance</h3>
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-secondary">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Orders</th>
                  <th className="pb-3 font-medium">Revenue</th>
                  <th className="pb-3 font-medium">Avg order</th>
                </tr>
              </thead>
              <tbody>
                {staffData.map((staff) => (
                  <tr key={staff.id} className="border-b border-border last:border-0">
                    <td className="py-3 font-medium">{staff.name}</td>
                    <td className="py-3 text-secondary">{staff.orders_served || 0}</td>
                    <td className="py-3">£{parseFloat(staff.total_revenue || 0).toFixed(2)}</td>
                    <td className="py-3 text-secondary">£{parseFloat(staff.avg_order_value || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tableData.length > 0 && (
        <div className="card mt-4">
          <h3 className="text-sm font-semibold text-primary mb-4">Table analytics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tableData.map((table) => (
              <div key={table.id} className="bg-muted rounded-lg p-3">
                <p className="text-sm font-medium">Table {table.table_number}</p>
                <p className="text-xs text-secondary mt-0.5">{table.orders_served || 0} orders</p>
                <p className="text-sm font-semibold mt-1">£{parseFloat(table.total_revenue || 0).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageLayout>
  );
}
