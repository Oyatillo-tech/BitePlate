import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { billsAPI, ordersAPI } from '../services/api';
import PageLayout from '../components/common/PageLayout';
import BillCard from '../components/billing/BillCard';
import GenerateBillModal from '../components/billing/GenerateBillModal';
import SplitBillModal from '../components/billing/SplitBillModal';
import Loading from '../components/common/Loading';
import ErrorAlert from '../components/common/ErrorAlert';
import SuccessAlert from '../components/common/SuccessAlert';
import { CreditCard, Plus } from 'lucide-react';

export default function BillingPage() {
  const location = useLocation();
  const currentOrder = useAppStore((state) => state.currentOrder);

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showGenerate, setShowGenerate] = useState(false);
  const [generateOrderId, setGenerateOrderId] = useState(null);
  const [splitBill, setSplitBill] = useState(null);
  const [pendingOrders, setPendingOrders] = useState([]);

  const orderIdFromNav = location.state?.orderId || currentOrder?.id;

  const fetchBills = async () => {
    try {
      const [billsRes, ordersRes] = await Promise.all([
        billsAPI.getPending(),
        ordersAPI.getAll(),
      ]);

      const pendingBills = billsRes.data.data || [];
      setBills(pendingBills);

      const orders = ordersRes.data.data || [];
      const billedOrderIds = new Set(pendingBills.map((b) => b.order_id));
      setPendingOrders(orders.filter((o) =>
        ['READY', 'CONFIRMED', 'PREPARING'].includes(o.status) && !billedOrderIds.has(o.id)
      ));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load bills');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
    if (orderIdFromNav) {
      setGenerateOrderId(orderIdFromNav);
      setShowGenerate(true);
    }
  }, [orderIdFromNav]);

  const handlePay = async (billId, method) => {
    try {
      await billsAPI.pay(billId, method);
      setSuccess('Payment processed successfully');
      fetchBills();
    } catch (err) {
      setError(err.response?.data?.error || 'Error processing payment');
    }
  };

  const handleRefund = async (billId) => {
    try {
      await billsAPI.refund(billId);
      setSuccess('Refund processed');
      fetchBills();
    } catch (err) {
      setError(err.response?.data?.error || 'Error processing refund');
    }
  };

  if (loading) return <Loading />;

  return (
    <PageLayout title="Billing" subtitle="Manage bills and payments" icon={CreditCard}>
      <ErrorAlert message={error} onClose={() => setError('')} />
      <SuccessAlert message={success} onClose={() => setSuccess('')} />

      {pendingOrders.length > 0 && (
        <div className="card mb-6">
          <h3 className="text-sm font-semibold text-primary mb-4">Orders ready for billing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pendingOrders.map((order) => (
              <div key={order.id} className="flex justify-between items-center bg-muted rounded-lg p-3">
                <div>
                  <p className="text-sm font-medium">{order.order_number}</p>
                  <p className="text-xs text-secondary">£{parseFloat(order.total || 0).toFixed(2)}</p>
                </div>
                <button
                  onClick={() => { setGenerateOrderId(order.id); setShowGenerate(true); }}
                  className="btn-primary !py-1.5 text-xs"
                >
                  <Plus size={14} /> Bill
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {bills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bills.map((bill) => (
            <BillCard
              key={bill.id}
              bill={bill}
              onPay={handlePay}
              onRefund={handleRefund}
              onRefresh={fetchBills}
              onSplit={setSplitBill}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">No pending bills</div>
      )}

      {showGenerate && generateOrderId && (
        <GenerateBillModal
          orderId={generateOrderId}
          onClose={() => { setShowGenerate(false); setGenerateOrderId(null); }}
          onGenerated={() => { setSuccess('Bill generated'); fetchBills(); }}
        />
      )}

      {splitBill && (
        <SplitBillModal
          bill={splitBill}
          onClose={() => setSplitBill(null)}
          onSplit={() => { setSuccess('Bill split successfully'); fetchBills(); }}
        />
      )}
    </PageLayout>
  );
}
