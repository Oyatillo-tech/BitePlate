import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CHART_COLOR = '#18181b';

export default function RevenueChart({ data }) {
  const chartData = (data || []).map((row) => ({
    ...row,
    revenue: parseFloat(row.daily_revenue || row.revenue || 0),
    date: row.date ? new Date(row.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : row.date,
  }));

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-primary mb-4">Revenue trend (30 days)</h3>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#52525b' }} axisLine={{ stroke: '#e4e4e7' }} />
            <YAxis tick={{ fontSize: 11, fill: '#52525b' }} axisLine={{ stroke: '#e4e4e7' }} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid #e4e4e7', fontSize: 12 }}
              formatter={(v) => [`£${parseFloat(v).toFixed(2)}`, 'Revenue']}
            />
            <Line type="monotone" dataKey="revenue" stroke={CHART_COLOR} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-secondary text-center py-12 text-sm">No data available</p>
      )}
    </div>
  );
}
