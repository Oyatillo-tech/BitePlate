import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, change, icon: Icon, color = 'primary' }) {
    const isPositive = change >= 0;

    return (
        <div className="card p-6">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-600 font-medium mb-2">{title}</p>
                    <p className={`text-3xl font-bold text-${color}`}>{value}</p>
                    {change !== undefined && (
                        <div className={`flex items-center gap-1 mt-2 ${isPositive ? 'text-success' : 'text-danger'}`}>
                            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                            <span className="text-sm">{isPositive ? '+' : ''}{change}%</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 bg-${color}/10 rounded-lg`}>
                    <Icon size={32} className={`text-${color}`} />
                </div>
            </div>
        </div>
    );
}