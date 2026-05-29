import { Users, Clock } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useNavigate } from 'react-router-dom';

export default function TableCard({ table }) {
    const navigate = useNavigate();
    const setSelectedTable = useAppStore((state) => state.setSelectedTable);

    const getStatusColor = (status) => {
        switch (status) {
            case 'FREE': return 'bg-green-100 text-green-800 border-green-300';
            case 'OCCUPIED': return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'RESERVED': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'AWAITING_BILL': return 'bg-red-100 text-red-800 border-red-300';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusEmoji = (status) => {
        switch (status) {
            case 'FREE': return '✅';
            case 'OCCUPIED': return '🍴';
            case 'RESERVED': return '🔔';
            case 'AWAITING_BILL': return '💳';
            default: return '❓';
        }
    };

    const handleSelect = () => {
        setSelectedTable(table);
        navigate('/menu');
    };

    return (
        <div className={`card p-6 cursor-pointer transform hover:scale-105 transition-all ${table.status === 'FREE' ? 'hover:shadow-xl' : ''
            } ${table.status !== 'FREE' ? 'opacity-75' : ''}`}>
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800">Table {table.table_number}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <Users size={16} />
                        Capacity: {table.capacity}
                    </p>
                </div>
                <span className="text-3xl">{getStatusEmoji(table.status)}</span>
            </div>

            {/* Status Badge */}
            <div className={`badge ${getStatusColor(table.status)} font-semibold mb-4 block text-center`}>
                {table.status}
            </div>

            {/* Action Button */}
            <button
                onClick={handleSelect}
                disabled={table.status !== 'FREE'}
                className={`w-full btn transition-all ${table.status === 'FREE'
                        ? 'btn-primary'
                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    }`}
            >
                {table.status === 'FREE' ? 'Select Table' : 'Unavailable'}
            </button>
        </div>
    );
}