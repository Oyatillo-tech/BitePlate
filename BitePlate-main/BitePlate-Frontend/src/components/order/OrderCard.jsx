import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Receipt, Eye } from 'lucide-react';

const STATUS_BADGE = {
  CREATED: 'badge-warning',
  CONFIRMED: 'badge-primary',
  PREPARING: 'badge-warning',
  READY: 'badge-success',
  PAID: 'badge-success',
  CANCELLED: 'badge-danger',
};

export default function OrderCard({ order, onConfirm, onCancel, onView, onGenerateBill, onDiscount }) {
  const navigate = useNavigate();
  const canModify = ['CREATED', 'CONFIRMED'].includes(order.status);
  const canBill = ['READY', 'CONFIRMED', 'PREPARING'].includes(order.status);

  return (
    <div className="card-hover">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-primary">{order.order_number}</h3>
          <p className="text-xs text-secondary mt-0.5">Table #{order.table_id}</p>
        </div>
        <span className={`badge ${STATUS_BADGE[order.status] || 'badge-secondary'}`}>{order.status}</span>
      </div>

      <div className="flex justify-between text-sm mb-4">
        <span className="text-secondary">Total</span>
        <span className="font-semibold text-primary">£{parseFloat(order.total || 0).toFixed(2)}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => onView(order)} className="btn-secondary !py-1.5 !px-2.5 text-xs">
          <Eye size={14} /> View
        </button>
        {order.status === 'CREATED' && (
          <button onClick={() => onConfirm(order.id)} className="btn-primary !py-1.5 !px-2.5 text-xs">
            <CheckCircle size={14} /> Confirm
          </button>
        )}
        {canModify && (
          <button onClick={() => onCancel(order.id)} className="btn-danger !py-1.5 !px-2.5 text-xs">
            <XCircle size={14} /> Cancel
          </button>
        )}
        {canBill && (
          <button
            onClick={() => (onGenerateBill ? onGenerateBill(order) : navigate('/billing'))}
            className="btn-primary !py-1.5 !px-2.5 text-xs"
          >
            <Receipt size={14} /> Bill
          </button>
        )}
        {canModify && onDiscount && (
          <button onClick={() => onDiscount(order)} className="btn-secondary !py-1.5 !px-2.5 text-xs">
            Discount
          </button>
        )}
      </div>
    </div>
  );
}
