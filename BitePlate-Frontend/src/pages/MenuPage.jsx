import { useEffect, useState } from 'react';
import { menuAPI, ordersAPI } from '../services/api';
import { useAppStore } from '../store/useAppStore';
import MenuItemCard from '../components/MenuItemCard';
import OrderSummary from '../components/OrderSummary';
import './MenuPage.css';

export default function MenuPage() {
    const [items, setItems] = useState([]);
    const [selectedType, setSelectedType] = useState('STARTER');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const currentTable = useAppStore((state) => state.currentTable);
    const cartItems = useAppStore((state) => state.cartItems);
    const clearCart = useAppStore((state) => state.clearCart);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await menuAPI.getAll();
                setItems(response.data.data);
            } catch (error) {
                console.error('Error fetching menu:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, []);

    const filteredItems = items.filter(item => item.type === selectedType);

    const handlePlaceOrder = async () => {
        if (!currentTable) {
            alert('No table selected');
            return;
        }

        if (cartItems.length === 0) {
            alert('Cart is empty');
            return;
        }

        setSubmitting(true);
        try {
            const response = await ordersAPI.create({
                tableId: currentTable.id,
                staffId: 1, // TODO: Get from auth
                items: cartItems.map(item => ({
                    menu_item_id: item.menu_item_id,
                    quantity: item.quantity,
                    price: item.price,
                })),
            });

            alert('Order placed successfully!');
            clearCart();
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Error placing order');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="menu-page">
            <div className="menu-container">
                <div className="menu-main">
                    <h2>Menu</h2>
                    <div className="type-filter">
                        {['STARTER', 'MAIN', 'DESSERT', 'BEVERAGE'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type)}
                                className={`type-btn ${selectedType === type ? 'active' : ''}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    <div className="items-grid">
                        {filteredItems.map((item) => (
                            <MenuItemCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>

                <div className="menu-sidebar">
                    <OrderSummary />
                    <button
                        onClick={handlePlaceOrder}
                        disabled={cartItems.length === 0 || submitting}
                        className="btn-place-order"
                    >
                        {submitting ? 'Placing...' : 'Place Order'}
                    </button>
                </div>
            </div>
        </div>
    );
}