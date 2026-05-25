import { useEffect, useState } from 'react';
import { tablesAPI } from '../services/api';
import TableCard from '../components/TableCard';
import './Dashboard.css';

export default function Dashboard() {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTables = async () => {
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

    if (loading) return <div className="loading">Loading...</div>;

    const tablesByStatus = {
        FREE: tables.filter(t => t.status === 'FREE'),
        OCCUPIED: tables.filter(t => t.status === 'OCCUPIED'),
        RESERVED: tables.filter(t => t.status === 'RESERVED'),
        AWAITING_BILL: tables.filter(t => t.status === 'AWAITING_BILL'),
    };

    return (
        <div className="dashboard">
            <h1>Restaurant Dashboard</h1>

            <div className="stats">
                <div className="stat-card available">
                    <h3>{tablesByStatus.FREE.length}</h3>
                    <p>Available Tables</p>
                </div>
                <div className="stat-card occupied">
                    <h3>{tablesByStatus.OCCUPIED.length}</h3>
                    <p>Occupied</p>
                </div>
                <div className="stat-card reserved">
                    <h3>{tablesByStatus.RESERVED.length}</h3>
                    <p>Reserved</p>
                </div>
                <div className="stat-card awaiting">
                    <h3>{tablesByStatus.AWAITING_BILL.length}</h3>
                    <p>Awaiting Bill</p>
                </div>
            </div>

            <div className="tables-section">
                <h2>Floor Plan</h2>
                <div className="tables-grid">
                    {tables.map((table) => (
                        <TableCard key={table.id} table={table} />
                    ))}
                </div>
            </div>
        </div>
    );
}