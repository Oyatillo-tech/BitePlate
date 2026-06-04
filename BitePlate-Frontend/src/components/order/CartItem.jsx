import { Trash2, Plus, Minus } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function CartItem({ item }) {
    const removeFromCart = useAppStore((state) => state.removeFromCart);
    const updateCartItem = useAppStore((state) => state.updateCartItem);

    return (
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-primary transition-colors">
            <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{item.name}</h4>
                <p className="text-sm text-gray-600">£{parseFloat(item.price || 0).toFixed(2)}each</p>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => updateCartItem(item.cartId, Math.max(1, item.quantity - 1))}
                    className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                >
                    <Minus size={16} />
                </button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button
                    onClick={() => updateCartItem(item.cartId, item.quantity + 1)}
                    className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                >
                    <Plus size={16} />
                </button>
            </div>

            <div className="text-right ml-4">
                <p className="font-bold text-primary">£{(item.price * item.quantity).toFixed(2)}</p>
            </div>

            <button
                onClick={() => removeFromCart(item.cartId)}
                className="ml-4 p-2 text-danger hover:bg-red-50 rounded-lg transition-colors"
            >
                <Trash2 size={18} />
            </button>
        </div>
    );
}