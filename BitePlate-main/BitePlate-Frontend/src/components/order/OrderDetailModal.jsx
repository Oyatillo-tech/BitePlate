import { X, Trash2 } from 'lucide-react';
import { ordersAPI } from '../../services/api';

export default function OrderDetailModal({ order, onClose, onUpdate }) {
  if (!order) return null;

  const handleRemoveItem = async (itemId) => {
    try {
      await ordersAPI.removeItem(order.id, itemId);
      onUpdate();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to remove item');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-primary">{order.order_number}</h3>
          <button onClick={onClose} className="btn-ghost !p-1"><X size={18} /></button>
        </div>

        <span className="badge-primary mb-4">{order.status}</span>

        <div className="space-y-2 mb-6">
          {(order.items || []).map((item) => (
            <div key={item.id} className="flex justify-between items-center rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium text-primary">{item.name}</p>
                <p className="text-xs text-secondary">{item.quantity}x £{parseFloat(item.item_price).toFixed(2)}</p>
                {item.special_requests && <p className="text-xs text-amber-700 mt-0.5">{item.special_requests}</p>}
              </div>
              {['CREATED', 'CONFIRMED'].includes(order.status) && (
                <button onClick={() => handleRemoveItem(item.id)} className="text-secondary hover:text-danger p-1">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-4 space-y-1 text-sm">
          <div className="flex justify-between text-secondary"><span>Subtotal</span><span>£{parseFloat(order.subtotal || 0).toFixed(2)}</span></div>
          <div className="flex justify-between text-secondary"><span>Tax</span><span>£{parseFloat(order.tax || 0).toFixed(2)}</span></div>
          <div className="flex justify-between font-semibold text-primary"><span>Total</span><span>£{parseFloat(order.total || 0).toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  );
}
