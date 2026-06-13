import { useState } from 'react';
import { Search } from 'lucide-react';
import MenuCard from './MenuCard';

const TYPES = ['STARTER', 'MAIN', 'DESSERT', 'BEVERAGE', 'COMBO'];

export default function MenuList({ items, onTypeChange, currentType }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = items
    .filter((item) => (currentType ? item.type === currentType : true))
    .filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
        <input
          type="text"
          placeholder="Search menu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input pl-9"
        />
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        <button onClick={() => onTypeChange(null)} className={`btn !py-1.5 !px-3 text-xs ${!currentType ? 'btn-primary' : 'btn-secondary'}`}>
          All
        </button>
        {TYPES.map((type) => (
          <button key={type} onClick={() => onTypeChange(type)} className={`btn !py-1.5 !px-3 text-xs whitespace-nowrap ${currentType === type ? 'btn-primary' : 'btn-secondary'}`}>
            {type}
          </button>
        ))}
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="empty-state">No items found</div>
      )}
    </div>
  );
}
