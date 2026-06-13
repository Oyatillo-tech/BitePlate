import { useState } from 'react';
import { reservationsAPI } from '../../services/api';

export default function ReservationForm({ tables, onSuccess, onError }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    tableId: '', customerName: '', customerPhone: '', customerEmail: '',
    reservationTime: '', partySize: 2, specialRequests: '',
  });

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await reservationsAPI.create({
        ...form,
        tableId: parseInt(form.tableId),
        partySize: parseInt(form.partySize),
      });
      onSuccess();
      setForm({ tableId: '', customerName: '', customerPhone: '', customerEmail: '', reservationTime: '', partySize: 2, specialRequests: '' });
    } catch (err) {
      onError(err.response?.data?.error || 'Failed to create reservation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h3 className="text-sm font-semibold text-primary">New reservation</h3>

      <div>
        <label className="block text-xs font-medium text-secondary mb-1.5">Table</label>
        <select name="tableId" value={form.tableId} onChange={handleChange} className="input" required>
          <option value="">Select table</option>
          {tables.filter((t) => ['FREE', 'RESERVED'].includes(t.status)).map((t) => (
            <option key={t.id} value={t.id}>Table {t.table_number} (cap: {t.capacity})</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-secondary mb-1.5">Customer name</label>
          <input name="customerName" value={form.customerName} onChange={handleChange} className="input" required />
        </div>
        <div>
          <label className="block text-xs font-medium text-secondary mb-1.5">Phone</label>
          <input name="customerPhone" value={form.customerPhone} onChange={handleChange} className="input" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-secondary mb-1.5">Email</label>
          <input type="email" name="customerEmail" value={form.customerEmail} onChange={handleChange} className="input" />
        </div>
        <div>
          <label className="block text-xs font-medium text-secondary mb-1.5">Party size</label>
          <input type="number" min="1" name="partySize" value={form.partySize} onChange={handleChange} className="input" required />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-secondary mb-1.5">Date & time</label>
        <input type="datetime-local" name="reservationTime" value={form.reservationTime} onChange={handleChange} className="input" required />
      </div>

      <div>
        <label className="block text-xs font-medium text-secondary mb-1.5">Special requests</label>
        <textarea name="specialRequests" value={form.specialRequests} onChange={handleChange} className="input min-h-[60px]" />
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Creating...' : 'Create reservation'}
      </button>
    </form>
  );
}
