import { ShoppingCart } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import CartItem from './CartItem';

export default function OrderSummary() {
  const cartItems = useAppStore((state) => state.cartItems);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.2;
  const total = subtotal + tax;

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart size={18} className="text-secondary" />
        <h2 className="text-sm font-semibold text-primary">Order Summary</h2>
      </div>

      {cartItems.length === 0 ? (
        <p className="text-sm text-secondary text-center py-8">Cart is empty</p>
      ) : (
        <>
          <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
            {cartItems.map((item) => (
              <CartItem key={item.cartId} item={item} />
            ))}
          </div>
          <div className="border-t border-border pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-secondary">
              <span>Subtotal</span><span>£{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-secondary">
              <span>Tax (20%)</span><span>£{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-primary pt-1">
              <span>Total</span><span>£{total.toFixed(2)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
