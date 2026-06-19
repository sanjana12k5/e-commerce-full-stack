import { Clock } from 'lucide-react';

export default function OrdersPage({ myOrders, loadingOrders, navigate }) {
  return (
    <section>
      <h1 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>Track Your Orders</h1>

      {loadingOrders ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading order data...</p>
        </div>
      ) : myOrders.length === 0 ? (
        <div className="empty-state">
          <Clock className="icon" style={{ width: '4rem', height: '4rem', strokeWidth: 1.5, color: 'var(--text-muted)' }} />
          <p className="empty-state-title">No Orders Yet</p>
          <p className="empty-state-text">You haven't placed any purchases yet. Your placed orders will appear here for tracking.</p>
          <button className="btn btn-primary" onClick={() => navigate('catalog')}>
            Browse Shop
          </button>
        </div>
      ) : (
        <div className="orders-table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date Placed</th>
                <th>Items Count</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myOrders.map((order) => (
                <tr key={order._id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{order._id}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.products?.reduce((sum, item) => sum + item.quantity, 0)} items</td>
                  <td style={{ fontWeight: 700 }}>${order.totalAmount.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => navigate('order-detail', { orderId: order._id })}
                    >
                      Check Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
