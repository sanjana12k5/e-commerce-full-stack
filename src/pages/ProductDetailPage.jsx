import { ArrowLeft, Plus, Minus } from 'lucide-react';

export default function ProductDetailPage({
  detailProduct, loadingDetail, detailQty, setDetailQty,
  navigate, addToCart, getProductImage
}) {
  return (
    <section>
      <button className="btn btn-secondary btn-sm" onClick={() => navigate('catalog')} style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft className="icon" /> Back to Catalog
      </button>

      {loadingDetail || !detailProduct ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading item specifications...</p>
        </div>
      ) : (
        <div className="product-detail-layout">
          <div className="detail-image-container">
            <img
              className="detail-image"
              src={getProductImage(detailProduct)}
              alt={detailProduct.name}
            />
          </div>

          <div className="detail-info">
            <span className="detail-category">{detailProduct.category}</span>
            <h1 className="detail-name">{detailProduct.name}</h1>
            <span className="detail-price">${detailProduct.price.toFixed(2)}</span>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              {detailProduct.quantity > 0 ? (
                <span className="stock-status in-stock">Available stock ({detailProduct.quantity} items)</span>
              ) : (
                <span className="stock-status out-of-stock">Backordered / Out of Stock</span>
              )}
            </div>

            <p className="detail-desc">{detailProduct.description}</p>

            {detailProduct.quantity > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Quantity:</span>
                <div className="cart-item-qty">
                  <button
                    className="cart-qty-btn"
                    onClick={() => setDetailQty((prev) => Math.max(1, prev - 1))}
                  >
                    <Minus style={{ width: '0.8rem', height: '0.8rem' }} />
                  </button>
                  <span style={{ fontWeight: 600, minWidth: '1.5rem', textAlign: 'center' }}>{detailQty}</span>
                  <button
                    className="cart-qty-btn"
                    onClick={() => setDetailQty((prev) => Math.min(detailProduct.quantity, prev + 1))}
                  >
                    <Plus style={{ width: '0.8rem', height: '0.8rem' }} />
                  </button>
                </div>

                <button
                  className="btn btn-primary"
                  style={{ marginTop: '1rem', alignSelf: 'flex-start' }}
                  onClick={() => addToCart(detailProduct, detailQty)}
                >
                  Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
