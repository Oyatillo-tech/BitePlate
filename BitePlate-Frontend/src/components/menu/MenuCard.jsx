import { ShoppingCart, AlertCircle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function MenuCard({ item }) {
    const addToCart = useAppStore((state) => state.addToCart);

    const handleAddToCart = () => {
        addToCart({
            menu_item_id: item.id,
            name: item.name,
            price: item.price,
            type: item.type,
            quantity: 1,
            description: item.description,
            vegan: item.vegan,
            allergens: item.allergens,
        });
    };

    return (
        <div className="card p-6 hover:scale-105 transition-transform">
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                    <span className="badge badge-primary text-xs">{item.type}</span>
                </div>
                <span className="text-2xl font-bold text-primary">£{item.price.toFixed(2)}</span>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>

            {/* Badges */}
            <div className="flex gap-2 mb-4 flex-wrap">
                {item.vegan && (
                    <span className="badge badge-success">🌱 Vegan</span>
                )}
                {item.allergens && (
                    <span className="badge badge-warning flex items-center gap-1">
                        <AlertCircle size={14} />
                        {item.allergens}
                    </span>
                )}
            </div>

            {/* Add to Cart Button */}
            <button
                onClick={handleAddToCart}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
            >
                <ShoppingCart size={18} />
                <span>Add to Cart</span>
            </button>
        </div>
    );
}