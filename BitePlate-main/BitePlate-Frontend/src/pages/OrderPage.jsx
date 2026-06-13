import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ordersAPI, tablesAPI } from '../services/api';
import useAuth from '../hooks/useAuth';
import PageLayout from '../components/common/PageLayout';
import OrderCard from '../components/order/OrderCard';
import OrderDetailModal from '../components/order/OrderDetailModal';
import OrderSummary from '../components/order/OrderSummary';
import Loading from '../components/common/Loading';
import ErrorAlert from '../components/common/ErrorAlert';
import SuccessAlert from '../components/common/SuccessAlert';
import { ClipboardList } from 'lucide-react';

export default function OrderPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isCheckout = searchParams.get('checkout') === 'true';
  const { user } = useAuth();

  const cartItems = useAppStore((s) => s.cartItems);
  const selectedTable = useAppStore((s) => s.selectedTable);
  const clearCart = useAppStore((s) => s.clearCart);
  const setCurrentOrder = useAppStore((s) => s.setCurrentOrder);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [discountOrder, setDiscountOrder] = useState(null);
  const [discountPct, setDiscountPct] = useState(10);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getAll();
      setOrders(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handlePlaceOrder = async () => {
    if (!selectedTable) { setError('Select a table first'); return navigate('/tables'); }
    if (!cartItems.length) { setError('Cart is empty'); return; }
    setSubmitting(true);
    setError('');
    try {
      await tablesAPI.seat(selectedTable.id);
      const response = await ordersAPI.create({
        tableId: selectedTable.id,
        staffId: user.id,
        items: cartItems.map((item) => ({
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          special_requests: item.special_requests || null,
        })),
      });
      clearCart();
      setCurrentOrder(response.data.data);
      setSuccess('Order created');
      await fetchOrders();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <PageLayout title="Orders" subtitle="Manage today's orders" icon={ClipboardList}>
      <ErrorAlert message={error} onClose={() => setError('')} />
      <SuccessAlert message={success} onClose={() => setSuccess('')} />

      {isCheckout && cartItems.length > 0 && (
        <div className="card mb-8 max-w-xl">
          <h2 className="text-sm font-semibold text-primary mb-4">
            Checkout — Table {selectedTable?.table_number}
          </h2>
          <OrderSummary />
          <button onClick={handlePlaceOrder} disabled={submitting} className="btn-primary w-full mt-4">
            {submitting ? 'Placing...' : 'Place order'}
          </button>
        </div>
      )}

      <h2 className="text-sm font-semibold text-primary mb-4">Today ({orders.length})</h2>

      {orders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onConfirm={async (id) => { await ordersAPI.confirm(id); setSuccess('Confirmed'); fetchOrders(); }}
              onCancel={async (id) => { if (confirm('Cancel order?')) { await ordersAPI.cancel(id); setSuccess('Cancelled'); fetchOrders(); } }}
              onView={async (o) => setSelectedOrder((await ordersAPI.getById(o.id)).data.data)}
              onGenerateBill={async (o) => { await tablesAPI.awaitBill(o.table_id); setCurrentOrder(o); navigate('/billing', { state: { orderId: o.id } }); }}
              onDiscount={setDiscountOrder}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">No orders today</div>
      )}

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={async () => {
            const res = await ordersAPI.getById(selectedOrder.id);
            setSelectedOrder(res.data.data);
            fetchOrders();
          }}
        />
      )}

      {discountOrder && (
        <div className="modal-overlay">
          <div className="modal max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Apply discount</h3>
            <input type="number" min="0" max="100" value={discountPct} onChange={(e) => setDiscountPct(parseInt(e.target.value) || 0)} className="input mb-4" />
            <div className="flex gap-2">
              <button onClick={() => setDiscountOrder(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={async () => {
                await ordersAPI.applyDiscount(discountOrder.id, discountPct);
                setSuccess('Discount applied');
                setDiscountOrder(null);
                fetchOrders();
              }} className="btn-primary flex-1">Apply</button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
