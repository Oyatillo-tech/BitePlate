import TableCard from './TableCard';
import { Grid2X2 } from 'lucide-react';

export default function TableGrid({ tables }) {
    if (!tables || tables.length === 0) {
        return (
            <div className="card p-12 text-center">
                <Grid2X2 size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No tables available</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tables.map((table) => (
                <TableCard key={table.id} table={table} />
            ))}
        </div>
    );
}