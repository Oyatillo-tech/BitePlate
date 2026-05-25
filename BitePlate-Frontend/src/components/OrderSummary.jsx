import { useAppStore } from '../store/useAppStore';

export default function OrderSummary() {
    const cartItems = useAppStore((state) => state.cartItems);
    const removeFromCart = useAppStore((state) => state.removeFromCart);

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.2;
    const total = subtotal + tax;

    return (
        <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="items-list">
                {cartItems.length === 0 ? (
                    <p>No items in order</p>
                ) : (
                    cartItems.map((item) => (
                        <div key={item.cartId} className="order-item">
                            <div className="item-info">
                                <span>{item.name}</span>
                                <span className="quantity">x{item.quantity}</span>
                            </div>
                            <div className="item-price">
                                <span>£{(item.price * item.quantity).toFixed(2)}</span>
                                <button
                                    onClick={() => removeFromCart(item.cartId)}
                                    className="btn-remove"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="order-totals">
                <div className="total-row">
                    <span>Subtotal:</span>
                    <span>£{subtotal.toFixed(2)}</span>
                </div>
                <div className="total-row">
                    <span>Tax (20%):</span>
                    <span>£{tax.toFixed(2)}</span>
                </div>
                <div className="total-row final">
                    <span>TOTAL:</span>
                    <span>£{total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}