export default function ProductCard({ product, addToCart, navigate, getProductImage }) {
  return (
    <article className="product-card">
      <div
        className="product-image-container"
        onClick={() => navigate('detail', { productId: product._id })}
        style={{ cursor: 'pointer' }}
      >
        <span className="product-category-badge">{product.category}</span>
        <img
          className="product-image"
          src={getProductImage(product)}
          alt={product.name}
        />
      </div>
      <div className="product-details">
        <h2
          className="product-name"
          onClick={() => navigate('detail', { productId: product._id })}
          style={{ cursor: 'pointer' }}
        >
          {product.name}
        </h2>
        <p className="product-desc-short">{product.description}</p>

        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>

          {product.quantity > 0 ? (
            <button className="btn btn-primary btn-sm" onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          ) : (
            <button className="btn btn-secondary btn-sm" disabled>
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
