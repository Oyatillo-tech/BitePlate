import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function RevenueChart({ data }) {
    return (
        <div className="card p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Revenue Trend</h3>
            {data && data.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#667eea" />
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-gray-500 text-center py-12">No data available</p>
            )}
        </div>
    );
}