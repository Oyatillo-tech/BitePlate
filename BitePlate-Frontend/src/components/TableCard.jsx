import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import './TableCard.css';

export default function TableCard({ table }) {
    const navigate = useNavigate();
    const setCurrentTable = useAppStore((state) => state.setCurrentTable);

    const getStatusColor = (status) => {
        switch (status) {
            case 'FREE': return '#4CAF50';
            case 'OCCUPIED': return '#FF9800';
            case 'RESERVED': return '#2196F3';
            case 'AWAITING_BILL': return '#FF5722';
            default: return '#999';
        }
    };

    const handleSelect = () => {
        setCurrentTable(table);
        navigate('/menu');
    };

    return (
        <div className="table-card" onClick={handleSelect}>
            <div className="table-number">Table {table.table_number}</div>
            <div className="table-capacity">👥 {table.capacity}</div>
            <div
                className="table-status"
                style={{ backgroundColor: getStatusColor(table.status) }}
            >
                {table.status}
            </div>
            <button className="btn-select">Select</button>
        </div>
    );
}