import { useState } from 'react';
import { billsAPI } from '../../services/api';
import { Split } from 'lucide-react';

const STRATEGIES = [
  { value: 'STANDARD', label: 'Standard' },
  { value: 'HAPPY_HOUR', label: 'Happy Hour (20% off)' },
  { value: 'LOYALTY_CARD', label: 'Loyalty (10% off)' },
  { value: 'WEEKEND', label: 'Weekend surcharge' },
  { value: 'GROUP', label: 'Group discount' },
  { value: 'CORPORATE', label: 'Corporate' },
];

export default function GenerateBillModal({ orderId, onClose, onGenerated }) {
  const [strategy, setStrategy] = useState('STANDARD');
  const [partySize, setPartySize] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await billsAPI.generate(orderId, { pricingStrategy: strategy, partySize });
      onGenerated(response.data.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate bill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal max-w-md">
        <h3 className="text-lg font-semibold text-primary mb-1">Generate bill</h3>
        <p className="text-xs text-secondary mb-4">Order #{orderId}</p>
        {error && <p className="text-xs text-danger mb-3">{error}</p>}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-secondary mb-1.5">Pricing strategy</label>
            <select value={strategy} onChange={(e) => setStrategy(e.target.value)} className="input">
              {STRATEGIES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          {strategy === 'GROUP' && (
            <div>
              <label className="block text-xs font-medium text-secondary mb-1.5">Party size</label>
              <input type="number" min="1" value={partySize} onChange={(e) => setPartySize(parseInt(e.target.value) || 1)} className="input" />
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-6">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleGenerate} disabled={loading} className="btn-primary flex-1">{loading ? 'Generating...' : 'Generate'}</button>
        </div>
      </div>
    </div>
  );
}
