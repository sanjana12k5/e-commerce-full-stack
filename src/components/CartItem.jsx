import { Trash2, Plus, Minus } from 'lucide-react';

export default function CartItem({ item, adjustQty, removeFromCart, navigate, getProductImage }) {
  return (
    <div className="cart-item">
      <img
        className="cart-item-image"
        src={getProductImage({ category: item.category })}
        alt={item.name}
      />
      <div className="cart-item-details">
        <h3 className="cart-item-name" onClick={() => navigate('detail', { productId: item.product })}>
          {item.name}
        </h3>
        <span className="cart-item-category">{item.category}</span>
      </div>

      <div className="cart-item-qty">
        <button className="cart-qty-btn" onClick={() => adjustQty(item.product, -1)}>
          <Minus style={{ width: '0.8rem', height: '0.8rem' }} />
        </button>
        <span style={{ fontWeight: 600, width: '1.5rem', textAlign: 'center' }}>{item.qty}</span>
        <button className="cart-qty-btn" onClick={() => adjustQty(item.product, 1)}>
          <Plus style={{ width: '0.8rem', height: '0.8rem' }} />
        </button>
      </div>

      <div style={{ fontWeight: 700, minWidth: '80px', textAlign: 'right' }}>
        ${(item.price * item.qty).toFixed(2)}
      </div>

      <button
        className="theme-btn"
        style={{ color: '#ef4444' }}
        onClick={() => removeFromCart(item.product)}
      >
        <Trash2 className="icon" />
      </button>
    </div>
  );
}
