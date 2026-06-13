import { useEffect, useState } from 'react';
import { reservationsAPI, tablesAPI } from '../services/api';
import PageLayout from '../components/common/PageLayout';
import ReservationForm from '../components/reservation/ReservationForm';
import ReservationList from '../components/reservation/ReservationList';
import Loading from '../components/common/Loading';
import ErrorAlert from '../components/common/ErrorAlert';
import SuccessAlert from '../components/common/SuccessAlert';
import { CalendarDays } from 'lucide-react';

export default function ReservationPage() {
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = async () => {
    try {
      const [tablesRes, reservationsRes, upcomingRes] = await Promise.all([
        tablesAPI.getAll(),
        reservationsAPI.getByDate(selectedDate),
        reservationsAPI.getUpcoming(4),
      ]);
      setTables(tablesRes.data.data || []);
      setReservations(reservationsRes.data.data || []);
      setUpcoming(upcomingRes.data.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [selectedDate]);

  if (loading) return <Loading />;

  return (
    <PageLayout title="Reservations" subtitle="Manage table bookings" icon={CalendarDays}>
      <ErrorAlert message={error} onClose={() => setError('')} />
      <SuccessAlert message={success} onClose={() => setSuccess('')} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <ReservationForm tables={tables} onSuccess={() => { setSuccess('Reservation created'); fetchData(); }} onError={setError} />
          {upcoming.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-primary mb-3">Upcoming (4h)</h3>
              <ReservationList reservations={upcoming} onCancel={async (id) => { await reservationsAPI.cancel(id); fetchData(); }} onComplete={async (id) => { await reservationsAPI.complete(id); fetchData(); }} />
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-sm font-semibold text-primary">By date</h2>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="input w-auto !py-1.5" />
          </div>
          <ReservationList reservations={reservations} onCancel={async (id) => { if (confirm('Cancel?')) { await reservationsAPI.cancel(id); fetchData(); } }} onComplete={async (id) => { await reservationsAPI.complete(id); fetchData(); }} />
        </div>
      </div>
    </PageLayout>
  );
}
