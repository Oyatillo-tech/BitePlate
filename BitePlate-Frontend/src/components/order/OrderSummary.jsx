import { useAppStore } from '../../store/useAppStore';
import CartItem from './CartItem';
import { ShoppingCart } from 'lucide-react';

export default function OrderSummary() {
    const cartItems = useAppStore((state) => state.cartItems);

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.2;
    const total = subtotal + tax;

    return (
        <div className="card p-6 h-fit sticky top-20">
            <div className="flex items-center gap-2 mb-6">
                <ShoppingCart size={24} className="text-primary" />
                <h2 className="text-2xl font-bold text-gray-800">Order Summary</h2>
            </div>

            {cartItems.length === 0 ? (
                <div className="text-center py-12">
                    <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">No items in order</p>
                </div>
            ) : (
                <>
                    {/* Items */}
                    <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                        {cartItems.map((item) => (
                            <CartItem key={item.cartId} item={item} />
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="border-t-2 border-gray-200 my-6"></div>

                    {/* Totals */}
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-gray-700">
                            <span>Subtotal:</span>
                            <span className="font-semibold">£{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-700">
                            <span>Tax (20%):</span>
                            <span className="font-semibold">£{tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold bg-primary/10 p-3 rounded-lg text-primary">
                            <span>TOTAL:</span>
                            <span>£{total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Items Count */}
                    <p className="text-center text-sm text-gray-600">
                        {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
                    </p>
                </>
            )}
        </div>
    );
}