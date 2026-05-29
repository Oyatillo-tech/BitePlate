import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { menuAPI } from '../services/api';
import Navbar from '../components/common/Navbar';
import MenuList from '../components/menu/MenuList';
import OrderSummary from '../components/order/OrderSummary';
import Loading from '../components/common/Loading';
import { ChefHat } from 'lucide-react';

export default function MenuPage() {
    const navigate = useNavigate();
    const [menuType, setMenuType] = useState(null);
    const [loading, setLoading] = useState(true);

    const menu = useAppStore((state) => state.menu);
    const setMenu = useAppStore((state) => state.setMenu);
    const selectedTable = useAppStore((state) => state.selectedTable);
    const cartItems = useAppStore((state) => state.cartItems);
    const clearCart = useAppStore((state) => state.clearCart);

    useEffect(() => {
        if (!selectedTable) {
            navigate('/tables');
            return;
        }

        const fetchMenu = async () => {
            setLoading(true);
            try {
                const response = await menuAPI.getAll();
                setMenu(response.data.data);
            } catch (error) {
                console.error('Error fetching menu:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, []);

    const handlePlaceOrder = async () => {
        if (cartItems.length === 0) {
            alert('Cart is empty');
            return;
        }

        // Proceed to checkout
        navigate('/orders');
    };

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <ChefHat className="text-primary" size={32} />
                        <h1 className="text-4xl font-bold text-gray-800">
                            Table {selectedTable?.table_number} - Order
                        </h1>
                    </div>
                    <p className="text-gray-600">Select items to add to your order</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Menu Items */}
                    <div className="lg:col-span-2">
                        <MenuList
                            items={menu}
                            onTypeChange={setMenuType}
                            currentType={menuType}
                        />
                    </div>

                    {/* Order Summary */}
                    <div>
                        <OrderSummary />
                        <button
                            onClick={handlePlaceOrder}
                            className="btn btn-primary w-full mt-4"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}