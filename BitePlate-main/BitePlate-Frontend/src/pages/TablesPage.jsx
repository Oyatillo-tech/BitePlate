import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { tablesAPI } from '../services/api';
import PageLayout from '../components/common/PageLayout';
import TableGrid from '../components/table/TableGrid';
import Loading from '../components/common/Loading';
import { LayoutGrid } from 'lucide-react';

export default function TablesPage() {
  const tables = useAppStore((state) => state.tables);
  const setTables = useAppStore((state) => state.setTables);
  const loading = useAppStore((state) => state.loading);
  const setLoading = useAppStore((state) => state.setLoading);

  useEffect(() => {
    const fetchTables = async () => {
      setLoading(true);
      try {
        const response = await tablesAPI.getAll();
        setTables(response.data.data);
      } catch (error) {
        console.error('Error fetching tables:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTables();
  }, [setLoading, setTables]);

  const refreshTables = async () => {
    try {
      const response = await tablesAPI.getAll();
      setTables(response.data.data);
    } catch (error) {
      console.error('Error refreshing tables:', error);
    }
  };

  if (loading) return <Loading />;

  return (
    <PageLayout
      title="Tables"
      subtitle="Select a table to start an order"
      icon={LayoutGrid}
    >
      <TableGrid tables={tables} onRefresh={refreshTables} />
    </PageLayout>
  );
}
