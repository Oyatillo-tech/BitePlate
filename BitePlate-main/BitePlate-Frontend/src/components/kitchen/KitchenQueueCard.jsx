import { Clock, CheckCircle } from 'lucide-react';

export default function KitchenQueueCard({ item, onStatusChange, onPriorityChange, onComplete, canManage }) {
  const items = Array.isArray(item.items) ? item.items.filter((i) => i.name) : [];

  return (
    <div className="card-hover">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-primary">#{item.order_number}</h3>
          <p className="text-xs text-secondary flex items-center gap-1 mt-0.5">
            <Clock size={12} /> {new Date(item.created_at).toLocaleTimeString()}
          </p>
        </div>
        <span className="badge-primary">{item.status}</span>
      </div>

      <div className="space-y-1 mb-4">
        {items.map((oi, idx) => (
          <p key={idx} className="text-xs text-secondary">{oi.quantity}x {oi.name}</p>
        ))}
      </div>

      {canManage && (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-secondary">Priority: {item.priority || 0}</label>
            <input
              type="range" min="0" max="10" value={item.priority || 0}
              onChange={(e) => onPriorityChange(item.order_id, parseInt(e.target.value))}
              className="w-full mt-1 accent-primary"
            />
          </div>
          <div className="flex gap-2">
            {item.status === 'PENDING' && (
              <button onClick={() => onStatusChange(item.order_id, 'PREPARING')} className="btn-warning flex-1 text-xs">
                Start
              </button>
            )}
            {item.status === 'PREPARING' && (
              <button onClick={() => onComplete(item.order_id)} className="btn-success flex-1 text-xs">
                <CheckCircle size={14} /> Ready
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
