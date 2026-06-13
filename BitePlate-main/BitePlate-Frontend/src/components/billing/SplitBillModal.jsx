import { useState } from 'react';
import { billsAPI } from '../../services/api';

export default function SplitBillModal({ bill, onClose, onSplit }) {
  const billTotal = parseFloat(bill.final_total || bill.total || 0);
  const [splits, setSplits] = useState([
    { label: 'Guest 1', amount: (billTotal / 2).toFixed(2), paymentMethod: 'CARD' },
    { label: 'Guest 2', amount: (billTotal / 2).toFixed(2), paymentMethod: 'CARD' },
  ]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const splitTotal = splits.reduce((sum, s) => sum + parseFloat(s.amount || 0), 0);

  const handleSubmit = async () => {
    if (Math.abs(splitTotal - billTotal) > 0.01) {
      setError(`Total must equal £${billTotal.toFixed(2)}`);
      return;
    }
    setLoading(true);
    try {
      await billsAPI.split(bill.id, splits.map((s) => ({ label: s.label, amount: parseFloat(s.amount), paymentMethod: s.paymentMethod })));
      onSplit();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to split');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal max-w-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-primary mb-1">Split bill #{bill.id}</h3>
        <p className="text-xs text-secondary mb-4">Total: £{billTotal.toFixed(2)}</p>
        {error && <p className="text-xs text-danger mb-3">{error}</p>}

        <div className="space-y-2 mb-4">
          {splits.map((split, idx) => (
            <div key={idx} className="grid grid-cols-3 gap-2">
              <input value={split.label} onChange={(e) => setSplits((p) => p.map((s, i) => i === idx ? { ...s, label: e.target.value } : s))} className="input text-xs" />
              <input type="number" step="0.01" value={split.amount} onChange={(e) => setSplits((p) => p.map((s, i) => i === idx ? { ...s, amount: e.target.value } : s))} className="input text-xs" />
              <select value={split.paymentMethod} onChange={(e) => setSplits((p) => p.map((s, i) => i === idx ? { ...s, paymentMethod: e.target.value } : s))} className="input text-xs">
                <option value="CARD">Card</option>
                <option value="CASH">Cash</option>
                <option value="MOBILE">Mobile</option>
              </select>
            </div>
          ))}
        </div>

        <p className={`text-xs mb-4 ${Math.abs(splitTotal - billTotal) > 0.01 ? 'text-danger' : 'text-success'}`}>
          Split: £{splitTotal.toFixed(2)} / £{billTotal.toFixed(2)}
        </p>

        <button onClick={() => setSplits((p) => [...p, { label: `Guest ${p.length + 1}`, amount: '0', paymentMethod: 'CARD' }])} className="btn-secondary w-full text-xs mb-4">
          Add guest
        </button>

        <div className="flex gap-2">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-1">{loading ? 'Splitting...' : 'Split'}</button>
        </div>
      </div>
    </div>
  );
}
