import { useState } from 'react';
import MenuCard from './MenuCard';
import { Search } from 'lucide-react';

export default function MenuList({ items, onTypeChange, currentType }) {
    const [searchQuery, setSearchQuery] = useState('');

    const types = ['STARTER', 'MAIN', 'DESSERT', 'BEVERAGE'];

    const filteredItems = items
        .filter(item => currentType ? item.type === currentType : true)
        .filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
        );

    return (
        <div>
            {/* Search Bar */}
            <div className="mb-6 relative">
                <Search className="absolute left-4 top-3 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search menu items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input pl-12"
                />
            </div>

            {/* Type Filter */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                <button
                    onClick={() => onTypeChange(null)}
                    className={`btn px-6 whitespace-nowrap ${!currentType ? 'btn-primary' : 'btn-secondary'
                        }`}
                >
                    All Items
                </button>
                {types.map((type) => (
                    <button
                        key={type}
                        onClick={() => onTypeChange(type)}
                        className={`btn px-6 whitespace-nowrap ${currentType === type ? 'btn-primary' : 'btn-secondary'
                            }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Items Grid */}
            {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                        <MenuCard key={item.id} item={item} />
                    ))}
                </div>
            ) : (
                <div className="card p-12 text-center">
                    <p className="text-gray-500 text-lg">No items found</p>
                </div>
            )}
        </div>
    );
}