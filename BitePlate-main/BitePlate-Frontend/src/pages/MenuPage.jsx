import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { menuAPI } from '../services/api';
import PageLayout from '../components/common/PageLayout';
import MenuList from '../components/menu/MenuList';
import OrderSummary from '../components/order/OrderSummary';
import Loading from '../components/common/Loading';
import { UtensilsCrossed } from 'lucide-react';

export default function MenuPage() {
  const navigate = useNavigate();
  const [menuType, setMenuType] = useState(null);
  const [loading, setLoading] = useState(true);

  const menu = useAppStore((state) => state.menu);
  const setMenu = useAppStore((state) => state.setMenu);
  const selectedTable = useAppStore((state) => state.selectedTable);
  const cartItems = useAppStore((state) => state.cartItems);

  useEffect(() => {
    if (!selectedTable) {
      navigate('/tables');
      return;
    }

    const fetchMenu = async () => {
      setLoading(true);
      try {
        const [menuRes, combosRes] = await Promise.all([
          menuAPI.getAll(),
          menuAPI.getCombos().catch(() => ({ data: { data: [] } })),
        ]);
        const regular = menuRes.data.data || [];
        const combos = (combosRes.data.data || []).map((c) => ({ ...c, type: 'COMBO' }));
        const comboIds = new Set(combos.map((c) => c.id));
        setMenu([...regular.filter((m) => !comboIds.has(m.id)), ...combos]);
      } catch (error) {
        console.error('Error fetching menu:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [selectedTable, navigate, setMenu]);

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return alert('Cart is empty');
    navigate('/orders?checkout=true');
  };

  if (loading) return <Loading />;

  return (
    <PageLayout
      title={`Table ${selectedTable?.table_number}`}
      subtitle="Select items for the order"
      icon={UtensilsCrossed}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MenuList items={menu} onTypeChange={setMenuType} currentType={menuType} />
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-4">
            <OrderSummary />
            <button onClick={handlePlaceOrder} className="btn-primary w-full">
              Proceed to checkout
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
