export default function KitchenStats({ stats }) {
  if (!stats) return null;
  const items = [
    { label: 'Pending', value: stats.pending_orders || 0 },
    { label: 'Preparing', value: stats.preparing_orders || 0 },
    { label: 'Ready', value: stats.ready_orders || 0 },
    { label: 'Avg prep', value: `${stats.avg_prep_time_minutes ? parseFloat(stats.avg_prep_time_minutes).toFixed(1) : '0'}m` },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {items.map((item) => (
        <div key={item.label} className="stat-card">
          <span className="stat-label">{item.label}</span>
          <p className="stat-value">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
