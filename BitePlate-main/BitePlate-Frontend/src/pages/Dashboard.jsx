import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { tablesAPI, analyticsAPI, reservationsAPI } from '../services/api';
import PageLayout from '../components/common/PageLayout';
import TableGrid from '../components/table/TableGrid';
import StatCard from '../components/analytics/StatCard';
import Loading from '../components/common/Loading';
import { Users, UtensilsCrossed, CircleDollarSign, CalendarDays } from 'lucide-react';

export default function Dashboard() {
  const tables = useAppStore((state) => state.tables);
  const setTables = useAppStore((state) => state.setTables);
  const analytics = useAppStore((state) => state.analytics);
  const setAnalytics = useAppStore((state) => state.setAnalytics);
  const loading = useAppStore((state) => state.loading);
  const setLoading = useAppStore((state) => state.setLoading);
  const [upcomingReservations, setUpcomingReservations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tablesRes, analyticsRes, upcomingRes] = await Promise.all([
          tablesAPI.getAll(),
          analyticsAPI.getDashboard(),
          reservationsAPI.getUpcoming(4).catch(() => ({ data: { data: [] } })),
        ]);
        setTables(tablesRes.data.data);
        setAnalytics(analyticsRes.data.data);
        setUpcomingReservations(upcomingRes.data.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [setLoading, setTables, setAnalytics]);

  const refreshTables = async () => {
    try {
      const response = await tablesAPI.getAll();
      setTables(response.data.data);
    } catch (error) {
      console.error('Error refreshing tables:', error);
    }
  };

  if (loading) return <Loading />;

  const occupied = tables.filter((t) => t.status === 'OCCUPIED').length;
  const free = tables.filter((t) => t.status === 'FREE').length;

  return (
    <PageLayout title="Dashboard" subtitle="Restaurant overview">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Tables" value={tables.length} icon={Users} />
        <StatCard title="Occupied" value={occupied} icon={UtensilsCrossed} />
        <StatCard title="Available" value={free} icon={Users} />
        <StatCard
          title="Revenue"
          value={`£${parseFloat(analytics?.totalRevenue || 0).toFixed(2)}`}
          icon={CircleDollarSign}
        />
      </div>

      {upcomingReservations.length > 0 && (
        <section className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-primary flex items-center gap-2">
              <CalendarDays size={18} /> Upcoming Reservations
            </h2>
            <Link to="/reservations" className="text-sm text-accent hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {upcomingReservations.slice(0, 3).map((res) => (
              <div key={res.id} className="rounded-lg border border-border bg-muted/50 p-4">
                <p className="font-medium text-primary">{res.customer_name}</p>
                <p className="text-xs text-secondary mt-1">
                  Table {res.table_number} · {new Date(res.reservation_time).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-base font-semibold text-primary mb-4">Floor Plan</h2>
        <TableGrid tables={tables} onRefresh={refreshTables} />
      </section>
    </PageLayout>
  );
}
