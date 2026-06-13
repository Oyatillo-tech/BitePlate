export default function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <span className="stat-label">{title}</span>
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-secondary">
            <Icon size={16} strokeWidth={1.75} />
          </div>
        )}
      </div>
      <p className="stat-value">{value}</p>
    </div>
  );
}
