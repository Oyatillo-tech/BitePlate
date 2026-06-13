import { Trash2, Plus, Minus } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function CartItem({ item }) {
  const removeFromCart = useAppStore((state) => state.removeFromCart);
  const updateCartItem = useAppStore((state) => state.updateCartItem);

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-primary truncate">{item.name}</p>
        <p className="text-xs text-secondary">£{parseFloat(item.price).toFixed(2)} each</p>
        {item.special_requests && (
          <p className="text-xs text-amber-700 mt-0.5 truncate">{item.special_requests}</p>
        )}
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => updateCartItem(item.cartId, Math.max(1, item.quantity - 1))} className="p-1 rounded hover:bg-white">
          <Minus size={14} />
        </button>
        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
        <button onClick={() => updateCartItem(item.cartId, item.quantity + 1)} className="p-1 rounded hover:bg-white">
          <Plus size={14} />
        </button>
      </div>
      <p className="text-sm font-medium text-primary w-14 text-right">
        £{(item.price * item.quantity).toFixed(2)}
      </p>
      <button onClick={() => removeFromCart(item.cartId)} className="p-1 text-secondary hover:text-danger">
        <Trash2 size={14} />
      </button>
    </div>
  );
}
