import { Users } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { tablesAPI } from '../../services/api';

const STATUS = {
  FREE: { label: 'Free', badge: 'badge-success', dot: 'bg-green-500' },
  OCCUPIED: { label: 'Occupied', badge: 'badge-warning', dot: 'bg-amber-500' },
  RESERVED: { label: 'Reserved', badge: 'badge-primary', dot: 'bg-zinc-500' },
  AWAITING_BILL: { label: 'Awaiting Bill', badge: 'badge-danger', dot: 'bg-red-500' },
  CLEARED: { label: 'Cleared', badge: 'badge-secondary', dot: 'bg-zinc-400' },
};

export default function TableCard({ table, onRefresh }) {
  const navigate = useNavigate();
  const setSelectedTable = useAppStore((state) => state.setSelectedTable);
  const user = useAppStore((state) => state.user);
  const status = STATUS[table.status] || STATUS.FREE;

  const handleSelect = async () => {
    try {
      await tablesAPI.seat(table.id);
      setSelectedTable(table);
      onRefresh?.();
      navigate('/menu');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to seat table');
    }
  };

  const handleReserve = () => navigate('/reservations');

  const handleViewOrders = () => {
    setSelectedTable(table);
    navigate('/orders');
  };

  const handleRequestBill = async () => {
    try {
      await tablesAPI.awaitBill(table.id);
      onRefresh?.();
      navigate('/billing');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update table');
    }
  };

  const handleClear = async () => {
    try {
      await tablesAPI.clear(table.id);
      onRefresh?.();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to clear table');
    }
  };

  return (
    <div className="card-hover">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-primary">Table {table.table_number}</h3>
          <p className="text-xs text-secondary flex items-center gap-1 mt-1">
            <Users size={12} /> {table.capacity} seats
          </p>
        </div>
        <span className={`inline-flex items-center gap-1.5 ${status.badge}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {table.status === 'FREE' && (
          <>
            <button onClick={handleSelect} className="btn-primary w-full">Select & Seat</button>
            <button onClick={handleReserve} className="btn-secondary w-full">Reserve</button>
          </>
        )}
        {table.status === 'OCCUPIED' && (
          <>
            <button onClick={handleViewOrders} className="btn-primary w-full">View Orders</button>
            <button onClick={handleRequestBill} className="btn-secondary w-full">Request Bill</button>
          </>
        )}
        {table.status === 'AWAITING_BILL' && (
          <button onClick={() => navigate('/billing')} className="btn-primary w-full">Go to Billing</button>
        )}
        {table.status === 'RESERVED' && (
          <button onClick={() => navigate('/reservations')} className="btn-secondary w-full">View Reservation</button>
        )}
        {(table.status === 'CLEARED' || user?.role === 'MANAGER') && table.status !== 'FREE' && (
          <button onClick={handleClear} className="btn-ghost w-full">Clear Table</button>
        )}
      </div>
    </div>
  );
}
