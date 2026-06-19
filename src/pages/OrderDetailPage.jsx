import { ArrowLeft } from 'lucide-react';
import OrderTimeline from '../components/OrderTimeline';

export default function OrderDetailPage({ selectedOrderDetails, loadingOrderDetails, navigate }) {
  return (
    <section>
      <button className="btn btn-secondary btn-sm" onClick={() => navigate('orders')} style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft className="icon" /> Back to My Orders
      </button>

      {loadingOrderDetails || !selectedOrderDetails ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading tracking information...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Order ID</span>
                <h2 style={{ fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: 700, marginTop: '0.2rem' }}>{selectedOrderDetails._id}</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Placed on {new Date(selectedOrderDetails.createdAt).toLocaleString()}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>Current Status</span>
                <span className={`status-badge status-${selectedOrderDetails.status.toLowerCase()}`} style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}>
                  {selectedOrderDetails.status}
                </span>
              </div>
            </div>

            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Delivery Tracking</h3>
            <OrderTimeline status={selectedOrderDetails.status} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="card">
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Shipping Address</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  <strong>Recipient:</strong> {selectedOrderDetails.userId?.name || 'Customer'}<br />
                  <strong>Phone Number:</strong> {selectedOrderDetails.userId?.phone || 'N/A'}<br />
                  <strong>Destination Address:</strong> {selectedOrderDetails.userId?.address || 'N/A'}
                </p>
              </div>

              <div className="card">
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Items Ordered</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {selectedOrderDetails.products?.map((item, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: index < selectedOrderDetails.products.length - 1 ? '1px solid var(--border-color)' : 'none', paddingBottom: index < selectedOrderDetails.products.length - 1 ? '1rem' : 0 }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{item.productId?.name || 'Item'}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Price: ${item.price.toFixed(2)} each</span>
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        x{item.quantity}
                      </div>
                      <div style={{ fontWeight: 700, minWidth: '80px', textAlign: 'right' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card" style={{ height: 'fit-content' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Bill Details</h3>
              <div className="summary-row" style={{ marginBottom: '0.75rem' }}>
                <span>Subtotal:</span>
                <span>${selectedOrderDetails.totalAmount.toFixed(2)}</span>
              </div>
              <div className="summary-row" style={{ marginBottom: '0.75rem' }}>
                <span>Shipping Fees:</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>FREE</span>
              </div>
              <div className="summary-row summary-total">
                <span>Total Paid:</span>
                <span>${selectedOrderDetails.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </section>
  );
}
