import { Edit, Trash2, PlusCircle } from 'lucide-react';
import StatsGrid from '../components/StatsGrid';
import Modal from '../components/Modal';

export default function AdminPage({
  adminTab, setAdminTab, stats,
  // Products
  products, loadingProducts, getProductImage,
  showProductModal, setShowProductModal, editingProduct,
  productForm, setProductForm,
  handleOpenAddProductModal, handleOpenEditProductModal, handleSaveProduct, handleDeleteProduct,
  // Orders
  allOrders, loadingAllOrders,
  handleUpdateOrderStatus, handleDeleteOrder,
  // Users
  usersList, loadingUsers, userInfo,
  showUserModal, setShowUserModal, editingUser,
  userForm, setUserForm,
  handleOpenAddUserModal, handleOpenEditUserModal, handleSaveUser, handleDeleteUser,
}) {
  return (
    <section>
      <h1 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>Admin Management Console</h1>

      <div className="tabs">
        <button className={`tab ${adminTab === 'stats' ? 'active' : ''}`} onClick={() => setAdminTab('stats')}>
          General Stats
        </button>
        <button className={`tab ${adminTab === 'products' ? 'active' : ''}`} onClick={() => setAdminTab('products')}>
          Manage Catalog
        </button>
        <button className={`tab ${adminTab === 'orders' ? 'active' : ''}`} onClick={() => setAdminTab('orders')}>
          Manage Orders
        </button>
        <button className={`tab ${adminTab === 'users' ? 'active' : ''}`} onClick={() => setAdminTab('users')}>
          Manage Users
        </button>
      </div>

      {/* Stats View */}
      {adminTab === 'stats' && (
        <div>
          <StatsGrid stats={stats} />
          <div className="card">
            <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>System Activity Log</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Welcome to the administrative portal. Here you can manipulate inventory counts, add and edit products, delete outdated entries, and update status logs for customer orders.
            </p>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
              * Deletions on orders automatically trigger inventory refunds in MongoDB database.
            </p>
          </div>
        </div>
      )}

      {/* Catalog Manager */}
      {adminTab === 'products' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 700 }}>Product Catalog List</h3>
            <button className="btn btn-primary btn-sm" onClick={handleOpenAddProductModal}>
              <PlusCircle className="icon" /> Add New Item
            </button>
          </div>

          {loadingProducts ? (
            <p>Loading items...</p>
          ) : (
            <div className="orders-table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock Count</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr key={prod._id}>
                      <td>
                        <img
                          src={getProductImage(prod)}
                          alt={prod.name}
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '0.25rem' }}
                        />
                      </td>
                      <td style={{ fontWeight: 600 }}>{prod.name}</td>
                      <td>{prod.category}</td>
                      <td style={{ fontWeight: 700 }}>${prod.price.toFixed(2)}</td>
                      <td>
                        {prod.quantity > 0 ? (
                          <span className="status-badge status-delivered" style={{ fontSize: '0.7rem' }}>
                            {prod.quantity} Left
                          </span>
                        ) : (
                          <span className="status-badge status-cancelled" style={{ fontSize: '0.7rem' }}>
                            OUT OF STOCK
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justify: 'flex-end', gap: '0.5rem' }}>
                          <button className="btn btn-secondary btn-sm btn-round" onClick={() => handleOpenEditProductModal(prod)} title="Edit">
                            <Edit className="icon" style={{ width: '0.9rem', height: '0.9rem' }} />
                          </button>
                          <button className="btn btn-danger btn-sm btn-round" onClick={() => handleDeleteProduct(prod._id)} title="Delete">
                            <Trash2 className="icon" style={{ width: '0.9rem', height: '0.9rem' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Orders Manager */}
      {adminTab === 'orders' && (
        <div>
          <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Customer Order Records</h3>

          {loadingAllOrders ? (
            <p>Loading customer orders...</p>
          ) : allOrders.length === 0 ? (
            <p>No customer orders placed yet.</p>
          ) : (
            <div className="orders-table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Purchased Items</th>
                    <th>Address</th>
                    <th>Total Amount</th>
                    <th>Status Badge</th>
                    <th style={{ textAlign: 'right' }}>Modify Status</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {allOrders.map((ord) => (
                    <tr key={ord._id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.8rem' }}>{ord._id}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600 }}>{ord.userId?.name || 'N/A'}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ord.userId?.email || 'N/A'}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          {ord.products?.map((item, idx) => (
                            <span key={idx} style={{ fontSize: '0.8rem' }}>
                              {item.productId?.name || 'Item'} ({item.quantity}x)
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {ord.userId?.address || 'N/A'}
                      </td>
                      <td style={{ fontWeight: 700 }}>${ord.totalAmount.toFixed(2)}</td>
                      <td>
                        <span className={`status-badge status-${ord.status?.toLowerCase()}`}>
                          {ord.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <select
                          className="form-control"
                          style={{ width: 'fit-content', padding: '0.25rem 0.5rem', fontSize: '0.8rem', display: 'inline-block' }}
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                        >
                          <option value="pending">pending</option>
                          <option value="confirmed">confirmed</option>
                          <option value="shipped">shipped</option>
                          <option value="delivered">delivered</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="theme-btn"
                          style={{ color: '#ef4444' }}
                          onClick={() => handleDeleteOrder(ord._id)}
                        >
                          <Trash2 className="icon" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Users Manager */}
      {adminTab === 'users' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 700 }}>Registered Users Database</h3>
            <button className="btn btn-primary btn-sm" onClick={handleOpenAddUserModal}>
              <PlusCircle className="icon" /> Add New User
            </button>
          </div>

          {loadingUsers ? (
            <p>Loading users list...</p>
          ) : (
            <div className="orders-table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Full Name</th>
                    <th>Email Address</th>
                    <th>Phone Number</th>
                    <th>Registered Address</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((usr) => (
                    <tr key={usr._id}>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 600 }}>{usr._id}</td>
                      <td style={{ fontWeight: 600 }}>
                        {usr.name} {usr.email.toLowerCase().includes('admin') && <span className="status-badge status-shipped" style={{ fontSize: '0.6rem', padding: '0.1rem 0.3rem', marginLeft: '0.3rem' }}>Admin</span>}
                      </td>
                      <td>{usr.email}</td>
                      <td>{usr.phone}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{usr.address}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justify: 'flex-end', gap: '0.5rem' }}>
                          <button className="btn btn-secondary btn-sm btn-round" onClick={() => handleOpenEditUserModal(usr)} title="Edit">
                            <Edit className="icon" style={{ width: '0.9rem', height: '0.9rem' }} />
                          </button>
                          <button className="btn btn-danger btn-sm btn-round" onClick={() => handleDeleteUser(usr._id)} title="Delete">
                            <Trash2 className="icon" style={{ width: '0.9rem', height: '0.9rem' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Product Modal */}
      <Modal
        show={showProductModal}
        onClose={() => setShowProductModal(false)}
        title={editingProduct ? 'Edit Catalog Product' : 'Add New Catalog Product'}
        onSubmit={handleSaveProduct}
        submitLabel="Save Changes"
      >
        <div className="form-group">
          <label className="form-label">Product Name</label>
          <input
            type="text"
            className="form-control"
            value={productForm.name}
            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Price ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="form-control"
              value={productForm.price}
              onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">In-Stock Quantity</label>
            <input
              type="number"
              min="0"
              className="form-control"
              value={productForm.quantity}
              onChange={(e) => setProductForm({ ...productForm, quantity: parseInt(e.target.value) || 0 })}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            className="form-control"
            value={productForm.category}
            onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
          >
            <option value="Electronics">Electronics</option>
            <option value="Office">Office</option>
            <option value="Home">Home</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Product Description</label>
          <textarea
            className="form-control"
            rows="3"
            value={productForm.description}
            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
            required
            style={{ resize: 'vertical' }}
          ></textarea>
        </div>
      </Modal>

      {/* User Modal */}
      <Modal
        show={showUserModal}
        onClose={() => setShowUserModal(false)}
        title={editingUser ? 'Edit User Profile' : 'Register New User'}
        onSubmit={handleSaveUser}
        submitLabel="Save Profile"
      >
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-control"
            value={userForm.name}
            onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-control"
            value={userForm.email}
            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input
            type="text"
            className="form-control"
            value={userForm.phone}
            onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Registered Address</label>
          <input
            type="text"
            className="form-control"
            value={userForm.address}
            onChange={(e) => setUserForm({ ...userForm, address: e.target.value })}
            required
          />
        </div>
      </Modal>
    </section>
  );
}
