import { CreditCard, DollarSign, Split } from 'lucide-react';
import { useState } from 'react';
import { billsAPI } from '../../services/api';

export default function BillCard({ bill, onPay, onRefund, onRefresh, onSplit }) {
  const [tip, setTip] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [showTipInput, setShowTipInput] = useState(false);

  const displayTotal = parseFloat(bill.final_total || bill.total || 0);
  const subtotal = parseFloat(bill.subtotal || 0);
  const tax = parseFloat(bill.tax || 0);

  const handleAddTip = async () => {
    try {
      await billsAPI.addTip(bill.id, parseFloat(tip) || 0);
      setShowTipInput(false);
      setTip('');
      onRefresh();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add tip');
    }
  };

  const handlePaySplit = async (splitId) => {
    try {
      await billsAPI.paySplit(splitId, paymentMethod);
      onRefresh();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to pay split');
    }
  };

  const statusBadge =
    bill.status === 'PAID' ? 'badge-success' :
    bill.status === 'REFUNDED' ? 'badge-danger' :
    bill.status === 'SPLIT' ? 'badge-primary' :
    'badge-warning';

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-primary">Bill #{bill.id}</h3>
          <p className="text-xs text-secondary mt-0.5">Order #{bill.order_id}</p>
        </div>
        <span className={statusBadge}>{bill.status}</span>
      </div>

      <div className="space-y-2 mb-4 bg-muted rounded-lg p-3 text-sm">
        <div className="flex justify-between">
          <span className="text-secondary">Subtotal</span>
          <span>£{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-secondary">Tax</span>
          <span>£{tax.toFixed(2)}</span>
        </div>
        {parseFloat(bill.discount || 0) > 0 && (
          <div className="flex justify-between text-success">
            <span>Discount</span>
            <span>-£{parseFloat(bill.discount).toFixed(2)}</span>
          </div>
        )}
        {parseFloat(bill.tip || 0) > 0 && (
          <div className="flex justify-between text-accent">
            <span>Tip</span>
            <span>+£{parseFloat(bill.tip).toFixed(2)}</span>
          </div>
        )}
        <div className="border-t border-border pt-2 flex justify-between font-semibold">
          <span>Total</span>
          <span>£{displayTotal.toFixed(2)}</span>
        </div>
      </div>

      {bill.status === 'SPLIT' && bill.splits?.length > 0 && (
        <div className="mb-4 space-y-2">
          <p className="text-xs font-medium text-secondary uppercase tracking-wide">Split payments</p>
          {bill.splits.map((split) => (
            <div key={split.id} className="flex justify-between items-center bg-muted rounded-lg p-3">
              <div>
                <p className="text-sm font-medium">{split.label}</p>
                <p className="text-xs text-secondary">£{parseFloat(split.amount).toFixed(2)}</p>
              </div>
              {split.status === 'PENDING' ? (
                <button onClick={() => handlePaySplit(split.id)} className="btn-primary !py-1.5 text-xs">
                  Pay
                </button>
              ) : (
                <span className="badge-success">{split.status}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {bill.payment_method && bill.status === 'PAID' && (
        <p className="text-xs text-secondary mb-4">Paid via {bill.payment_method}</p>
      )}

      {bill.status === 'PENDING' && (
        <div className="space-y-2">
          {!showTipInput ? (
            <button onClick={() => setShowTipInput(true)} className="btn-secondary w-full text-xs">
              <DollarSign size={14} /> Add tip
            </button>
          ) : (
            <div className="flex gap-2">
              <input type="number" step="0.01" min="0" value={tip} onChange={(e) => setTip(e.target.value)} placeholder="Tip amount" className="input flex-1 !py-1.5 text-xs" />
              <button onClick={handleAddTip} className="btn-primary !py-1.5 text-xs">Save</button>
            </div>
          )}

          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="input !py-1.5 text-xs">
            <option value="CARD">Card</option>
            <option value="CASH">Cash</option>
            <option value="MOBILE">Mobile</option>
          </select>

          <button onClick={() => onPay(bill.id, paymentMethod)} className="btn-primary w-full text-xs">
            <CreditCard size={14} /> Pay now
          </button>

          <button onClick={() => onSplit(bill)} className="btn-secondary w-full text-xs">
            <Split size={14} /> Split bill
          </button>
        </div>
      )}

      {bill.status === 'PAID' && (
        <button onClick={() => onRefund(bill.id)} className="btn-danger w-full text-xs">
          Refund
        </button>
      )}
    </div>
  );
}
