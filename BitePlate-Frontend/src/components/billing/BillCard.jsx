import { CreditCard, DollarSign, TrendingUp } from 'lucide-react';

export default function BillCard({ bill, onPay, onRefund }) {
    const getPaymentMethodIcon = (method) => {
        switch (method) {
            case 'CARD': return '💳';
            case 'CASH': return '💵';
            case 'MOBILE': return '📱';
            default: return '💸';
        }
    };

    return (
        <div className="card p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">Bill #{bill.id}</h3>
                    <p className="text-sm text-gray-600">Order: {bill.order_id}</p>
                </div>
                <span className={`badge ${bill.status === 'PAID' ? 'badge-success' :
                        bill.status === 'REFUNDED' ? 'badge-danger' :
                            'badge-warning'
                    }`}>
                    {bill.status}
                </span>
            </div>

            {/* Amounts */}
            <div className="space-y-2 mb-6 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between">
                    <span className="text-gray-700">Subtotal:</span>
                    <span className="font-semibold">£{bill.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-700">Tax:</span>
                    <span className="font-semibold">£{bill.tax.toFixed(2)}</span>
                </div>
                {bill.discount > 0 && (
                    <div className="flex justify-between text-success">
                        <span>Discount:</span>
                        <span>-£{bill.discount.toFixed(2)}</span>
                    </div>
                )}
                {bill.tip > 0 && (
                    <div className="flex justify-between text-primary">
                        <span>Tip:</span>
                        <span>+£{bill.tip.toFixed(2)}</span>
                    </div>
                )}
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>£{bill.final_total.toFixed(2)}</span>
                </div>
            </div>

            {/* Payment Method */}
            {bill.payment_method && (
                <div className="flex items-center gap-2 mb-6 text-gray-700">
                    <span>{getPaymentMethodIcon(bill.payment_method)}</span>
                    <span>{bill.payment_method}</span>
                </div>
            )}

            {/* Actions */}
            {bill.status === 'PENDING' && (
                <div className="flex gap-2">
                    <button
                        onClick={() => onPay(bill.id)}
                        className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                        <CreditCard size={18} />
                        Pay Now
                    </button>
                </div>
            )}

            {bill.status === 'PAID' && (
                <div className="flex gap-2">
                    <button
                        onClick={() => onRefund(bill.id)}
                        className="btn btn-danger flex-1"
                    >
                        Refund
                    </button>
                </div>
            )}
        </div>
    );
}