import { useState } from 'react';
import { ShoppingCart, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function MenuCard({ item }) {
  const addToCart = useAppStore((state) => state.addToCart);
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const hasAllergens = item.allergens?.trim?.()?.length > 0;
  const isCombo = item.type === 'COMBO';

  const handleAddToCart = () => {
    addToCart({
      menu_item_id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      type: item.type,
      quantity,
      description: item.description,
      vegan: item.vegan,
      allergens: item.allergens,
      special_requests: specialRequests || null,
      comboItems: item.items || [],
    });
    setShowModal(false);
    setQuantity(1);
    setSpecialRequests('');
  };

  return (
    <>
      <div className="card-hover flex flex-col h-full">
        <div className="flex justify-between items-start gap-3 mb-2">
          <div>
            <h3 className="font-medium text-primary">{item.name}</h3>
            <span className="badge-primary mt-1">{item.type}</span>
          </div>
          <span className="text-base font-semibold text-primary whitespace-nowrap">
            £{parseFloat(item.price || 0).toFixed(2)}
          </span>
        </div>

        <p className="text-xs text-secondary line-clamp-2 mb-3 flex-1">{item.description}</p>

        {isCombo && item.items?.length > 0 && (
          <div className="text-xs text-secondary bg-muted rounded-lg p-2.5 mb-3">
            {item.items.map((ci, idx) => (
              <span key={idx}>{ci.quantity}x {ci.name}{idx < item.items.length - 1 ? ' · ' : ''}</span>
            ))}
          </div>
        )}

        <div className="flex gap-1.5 mb-4 flex-wrap">
          {item.vegan && <span className="badge-success">Vegan</span>}
          {hasAllergens && <span className="badge-warning">{item.allergens}</span>}
        </div>

        <button onClick={() => setShowModal(true)} className="btn-primary w-full mt-auto">
          <ShoppingCart size={16} /> Add
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal max-w-md">
            <h3 className="text-lg font-semibold text-primary mb-4">Add {item.name}</h3>

            {hasAllergens && (
              <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 mb-4 text-xs text-amber-800">
                <AlertTriangle size={16} className="flex-shrink-0" />
                <span>Contains: {item.allergens}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-secondary mb-1.5">Quantity</label>
                <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="input" />
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary mb-1.5">Special requests</label>
                <textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} placeholder="No onions, extra sauce..." className="input min-h-[72px]" />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleAddToCart} className="btn-primary flex-1">Add to cart</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
