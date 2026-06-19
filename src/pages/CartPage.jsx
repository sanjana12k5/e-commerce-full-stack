import { ShoppingCart } from 'lucide-react';
import CartItem from '../components/CartItem';

export default function CartPage({
  cartItems, adjustQty, removeFromCart, navigate,
  userInfo, getCartSubtotal, getProductImage, showToast
}) {
  return (
    <section>
      <h1 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="empty-state">
          <ShoppingCart className="icon" style={{ width: '4rem', height: '4rem', strokeWidth: 1.5, color: 'var(--text-muted)' }} />
          <p className="empty-state-title">Your Cart is Empty</p>
          <p className="empty-state-text">Explore our collection catalog to add premium gadgets and lifestyle items.</p>
          <button className="btn btn-primary" onClick={() => navigate('catalog')}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <CartItem
                key={item.product}
                item={item}
                adjustQty={adjustQty}
                removeFromCart={removeFromCart}
                navigate={navigate}
                getProductImage={getProductImage}
              />
            ))}
          </div>

          <div className="card cart-summary">
            <h3 style={{ fontWeight: 700 }}>Order Summary</h3>
            <div className="summary-row">
              <span>Total Quantity:</span>
              <span>{cartItems.reduce((acc, item) => acc + item.qty, 0)} items</span>
            </div>
            <div className="summary-row">
              <span>Shipping Charges:</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>FREE</span>
            </div>
            <div className="summary-row summary-total">
              <span>Total Amount:</span>
              <span>${getCartSubtotal()}</span>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem' }}
              onClick={() => {
                if (!userInfo) {
                  showToast('Please sign in to place your order.', 'error');
                  navigate('login');
                } else {
                  navigate('checkout');
                }
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
