import { useAppStore } from '../store/useAppStore';

export default function MenuItemCard({ item }) {
    const addToCart = useAppStore((state) => state.addToCart);

    const handleAdd = () => {
        addToCart({
            menu_item_id: item.id,
            name: item.name,
            price: item.price,
            type: item.type,
            quantity: 1,
        });
    };

    return (
        <div className="menu-card">
            <div className="menu-header">
                <h3>{item.name}</h3>
                <span className="price">£{item.price.toFixed(2)}</span>
            </div>
            <p className="description">{item.description}</p>
            <div className="menu-footer">
                {item.vegan && <span className="badge">🌱 Vegan</span>}
                {item.allergens && <span className="badge">⚠️ {item.allergens}</span>}
                <button onClick={handleAdd} className="btn-add">+ Add</button>
            </div>
        </div>
    );
}