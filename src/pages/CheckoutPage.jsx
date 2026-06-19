export default function CheckoutPage({ userInfo, cartItems, getCartSubtotal, handlePlaceOrder }) {
  return (
    <section>
      <h1 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>Confirm Details & Billing</h1>

      <div className="checkout-layout">
        <div className="card">
          <h3 className="checkout-section-title">Delivery Profile Info</h3>
          <div style={{ padding: '0.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
            <p>👤 <strong>Recipient Name:</strong> {userInfo?.name}</p>
            <p>📧 <strong>Email Address:</strong> {userInfo?.email}</p>
            <p>📞 <strong>Phone Number:</strong> {userInfo?.phone}</p>
            <p>📍 <strong>Registered Shipping Location:</strong> {userInfo?.address}</p>
          </div>

          <form onSubmit={handlePlaceOrder}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1.5rem' }}
            >
              Place Your Order
            </button>
          </form>
        </div>

        <div className="card cart-summary">
          <h3 style={{ fontWeight: 700 }}>Order Items</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '200px', overflowY: 'auto' }}>
            {cartItems.map((item) => (
              <div key={item.product} style={{ display: 'flex', justify: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {item.name} <strong style={{ color: 'var(--text-primary)' }}>x{item.qty}</strong>
                </span>
                <span style={{ fontWeight: 600 }}>${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="summary-row summary-total">
            <span>Total Bill Amount:</span>
            <span>${getCartSubtotal()}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
