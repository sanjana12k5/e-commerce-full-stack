import {
  ShoppingBag,
  ShoppingCart,
  User as UserIcon,
  LogOut,
  Sun,
  Moon,
  Clock
} from 'lucide-react';

export default function Navbar({ darkMode, setDarkMode, currentPage, navigate, cartItems, userInfo, handleLogout }) {
  return (
    <header className="navbar">
      <div className="nav-brand" onClick={() => navigate('catalog')}>
        <ShoppingBag className="icon" style={{ strokeWidth: 3 }} />
        <span>Swiftkart</span>
      </div>

      <nav className="nav-links">
        <button
          className={`nav-link ${currentPage === 'catalog' ? 'active' : ''}`}
          onClick={() => navigate('catalog')}
        >
          Catalog
        </button>

        {userInfo && (
          <button
            className={`nav-link ${currentPage === 'orders' || currentPage === 'order-detail' ? 'active' : ''}`}
            onClick={() => navigate('orders')}
          >
            <Clock className="icon" />
            <span>Track Orders</span>
          </button>
        )}

        {userInfo?.isAdmin && (
          <button
            className={`nav-link ${currentPage === 'admin' ? 'active' : ''}`}
            onClick={() => navigate('admin')}
          >
            <span>Manager Console</span>
          </button>
        )}

        <button
          className={`nav-link ${currentPage === 'cart' ? 'active' : ''}`}
          onClick={() => navigate('cart')}
        >
          <div className="cart-badge-container">
            <ShoppingCart className="icon" />
            {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
          </div>
          <span>Cart</span>
        </button>

        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)' }}></div>

        {userInfo ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
              <UserIcon className="icon" />
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{userInfo.name.split(' ')[0]}</span>
            </div>
            <button className="theme-btn" onClick={handleLogout} title="Sign Out">
              <LogOut className="icon" />
            </button>
          </div>
        ) : (
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('login')}>
            Sign In
          </button>
        )}

        <button
          className="theme-btn"
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle Theme"
        >
          {darkMode ? <Sun className="icon" /> : <Moon className="icon" />}
        </button>
      </nav>
    </header>
  );
}
