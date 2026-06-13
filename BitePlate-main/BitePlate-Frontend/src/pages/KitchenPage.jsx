import { useEffect, useState, useCallback } from 'react';
import { kitchenAPI } from '../services/api';
import useAuth from '../hooks/useAuth';
import PageLayout from '../components/common/PageLayout';
import KitchenQueueCard from '../components/kitchen/KitchenQueueCard';
import KitchenStats from '../components/kitchen/KitchenStats';
import Loading from '../components/common/Loading';
import ErrorAlert from '../components/common/ErrorAlert';
import SuccessAlert from '../components/common/SuccessAlert';
import { ChefHat } from 'lucide-react';

export default function KitchenPage() {
  const { user } = useAuth();
  const canManage = ['CHEF', 'MANAGER'].includes(user?.role);
  const [queue, setQueue] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [queueRes, statsRes] = await Promise.all([kitchenAPI.getQueue(), kitchenAPI.getStats()]);
      setQueue(queueRes.data.data || []);
      setStats(statsRes.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load kitchen queue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) return <Loading />;

  return (
    <PageLayout title="Kitchen" subtitle={canManage ? 'Manage preparation queue' : 'View only'} icon={ChefHat}>
      <ErrorAlert message={error} onClose={() => setError('')} />
      <SuccessAlert message={success} onClose={() => setSuccess('')} />
      <KitchenStats stats={stats} />

      {queue.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {queue.map((item) => (
            <KitchenQueueCard
              key={item.id}
              item={item}
              onStatusChange={async (id, s) => { await kitchenAPI.updateStatus(id, s); setSuccess(`Marked ${s}`); fetchData(); }}
              onPriorityChange={async (id, p) => { await kitchenAPI.reprioritize(id, p); fetchData(); }}
              onComplete={async (id) => { await kitchenAPI.complete(id); setSuccess('Order ready'); fetchData(); }}
              canManage={canManage}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">Kitchen queue is empty</div>
      )}
    </PageLayout>
  );
}
