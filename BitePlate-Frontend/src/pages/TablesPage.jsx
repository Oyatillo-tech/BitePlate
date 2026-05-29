import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { tablesAPI } from '../services/api';
import Navbar from '../components/common/Navbar';
import TableGrid from '../components/table/TableGrid';
import Loading from '../components/common/Loading';

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
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Tables</h1>
                    <p className="text-gray-600">Select a table to place an order</p>
                </div>

                <TableGrid tables={tables} />
            </div>
        </div>
    );
}