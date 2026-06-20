import { ShoppingBag } from 'lucide-react';

export default function Footer({ navigate, userInfo }) {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-column">
          <div className="nav-brand" style={{ cursor: 'default', marginBottom: '1rem' }}>
            <ShoppingBag className="icon" style={{ strokeWidth: 3 }} />
            <span>SwiftKart</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5 }}>
            Simplifying full-stack e-commerce. A lightweight and premium web-store dashboard connecting frontend clients directly to local backend databases.
          </p>
        </div>

        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><button onClick={() => navigate('catalog')}>Catalog Shop</button></li>
            <li><button onClick={() => {
              if (userInfo) navigate('orders');
              else navigate('login');
            }}>Track Order</button></li>
            <li><button onClick={() => navigate('cart')}>Shopping Cart</button></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} SwiftKart E-commerce Project. All rights reserved.</p>
      </div>
    </footer>
  );
}
