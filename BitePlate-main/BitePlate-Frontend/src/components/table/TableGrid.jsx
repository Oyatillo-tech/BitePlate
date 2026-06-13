import { Users } from 'lucide-react';
import TableCard from './TableCard';

export default function TableGrid({ tables, onRefresh }) {
  if (!tables?.length) {
    return <div className="empty-state">No tables available</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {tables.map((table) => (
        <TableCard key={table.id} table={table} onRefresh={onRefresh} />
      ))}
    </div>
  );
}
