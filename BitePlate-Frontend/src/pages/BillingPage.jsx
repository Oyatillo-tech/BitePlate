import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { billsAPI, ordersAPI } from '../services/api';
import Navbar from '../components/common/Navbar';
import BillCard from '../components/billing/BillCard';
import Loading from '../components/common/Loading';
import { CreditCard } from 'lucide-react';

export default function BillingPage() {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBills = async () => {
            setLoading(true);
            try {
                const response = await billsAPI.getPending();
                setBills(response.data.data);
            } catch (error) {
                console.error('Error fetching bills:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBills();
    }, []);

    const handlePay = async (billId) => {
        try {
            await billsAPI.pay(billId, 'CARD');
            alert('Payment processed successfully!');
            // Refresh bills
            const response = await billsAPI.getPending();
            setBills(response.data.data);
        } catch (error) {
            alert('Error processing payment');
        }
    };

    const handleRefund = async (billId) => {
        try {
            await billsAPI.refund(billId);
            alert('Refund processed!');
            // Refresh bills
            const response = await billsAPI.getPending();
            setBills(response.data.data);
        } catch (error) {
            alert('Error processing refund');
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <CreditCard className="text-primary" size={32} />
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800">Billing</h1>
                        <p className="text-gray-600">Manage bills and payments</p>
                    </div>
                </div>

                {bills.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bills.map((bill) => (
                            <BillCard
                                key={bill.id}
                                bill={bill}
                                onPay={handlePay}
                                onRefund={handleRefund}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="card p-12 text-center">
                        <p className="text-gray-500 text-lg">No pending bills</p>
                    </div>
                )}
            </div>
        </div>
    );
}