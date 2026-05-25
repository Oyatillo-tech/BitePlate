import { useEffect, useState } from 'react';
import { billsAPI } from '../services/api';

export default function BillingPage() {
    const [bills, setBills] = useState([]);
    const [selectedBill, setSelectedBill] = useState(null);
    const [tip, setTip] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('CARD');

    const handlePayBill = async () => {
        if (!selectedBill) return;

        try {
            // Add tip
            if (tip > 0) {
                await billsAPI.addTip(selectedBill.id, tip);
            }

            // Pay bill
            await billsAPI.pay(selectedBill.id, paymentMethod);
            alert('Bill paid successfully!');
            setSelectedBill(null);
            setTip(0);
        } catch (error) {
            console.error('Error paying bill:', error);
            alert('Error processing payment');
        }
    };

    return (
        <div className="billing-page">
            <h1>Billing</h1>

            {selectedBill ? (
                <div className="bill-details">
                    <h2>Bill #{selectedBill.id}</h2>
                    <div className="bill-info">
                        <div className="info-row">
                            <span>Subtotal:</span>
                            <span>£{selectedBill.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="info-row">
                            <span>Tax:</span>
                            <span>£{selectedBill.tax.toFixed(2)}</span>
                        </div>
                        {selectedBill.discount > 0 && (
                            <div className="info-row discount">
                                <span>Discount:</span>
                                <span>-£{selectedBill.discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="info-row total">
                            <span>Total:</span>
                            <span>£{selectedBill.total.toFixed(2)}</span>
                        </div>

                        <div className="tip-section">
                            <label>Add Tip:</label>
                            <input
                                type="number"
                                value={tip}
                                onChange={(e) => setTip(parseFloat(e.target.value))}
                                step="0.01"
                                min="0"
                            />
                        </div>

                        {tip > 0 && (
                            <div className="info-row final">
                                <span>Final Total:</span>
                                <span>£{(selectedBill.total + tip).toFixed(2)}</span>
                            </div>
                        )}

                        <div className="payment-method">
                            <label>Payment Method:</label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                <option value="CARD">Card</option>
                                <option value="CASH">Cash</option>
                                <option value="MOBILE">Mobile Payment</option>
                            </select>
                        </div>

                        <div className="bill-actions">
                            <button
                                onClick={handlePayBill}
                                className="btn-pay"
                            >
                                Complete Payment
                            </button>
                            <button
                                onClick={() => setSelectedBill(null)}
                                className="btn-cancel"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bills-list">
                    <p>Select a bill to process payment</p>
                </div>
            )}
        </div>
    );
}