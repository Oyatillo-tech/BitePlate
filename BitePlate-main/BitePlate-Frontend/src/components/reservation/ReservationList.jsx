import { Calendar, Phone, Users } from 'lucide-react';

export default function ReservationList({ reservations, onCancel, onComplete }) {
  if (!reservations?.length) return <div className="empty-state">No reservations found</div>;

  return (
    <div className="space-y-3">
      {reservations.map((res) => (
        <div key={res.id} className="card">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium text-primary">{res.customer_name}</h3>
              <p className="text-xs text-secondary mt-0.5">
                Table {res.table_number || res.table_id} · {res.party_size} guests
              </p>
            </div>
            <span className="badge-primary">{res.status}</span>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-secondary mb-3">
            <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(res.reservation_time).toLocaleString()}</span>
            {res.customer_phone && <span className="flex items-center gap-1"><Phone size={12} /> {res.customer_phone}</span>}
            <span className="flex items-center gap-1"><Users size={12} /> {res.party_size}</span>
          </div>

          {res.special_requests && (
            <p className="text-xs text-secondary bg-muted rounded-lg p-2 mb-3">{res.special_requests}</p>
          )}

          {res.status === 'CONFIRMED' && (
            <div className="flex gap-2">
              <button onClick={() => onComplete(res.id)} className="btn-primary !py-1.5 text-xs flex-1">Complete</button>
              <button onClick={() => onCancel(res.id)} className="btn-danger !py-1.5 text-xs flex-1">Cancel</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
