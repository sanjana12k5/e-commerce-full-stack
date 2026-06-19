import { Search, X, Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function CatalogPage({
  products, loadingProducts, categories, selectedCategory, setSelectedCategory,
  searchKeyword, setSearchKeyword, navigate, addToCart, getProductImage
}) {
  return (
    <section>
      <div className="hero-banner">
        <h1>Simple, Sleek, Secure Shopping</h1>
        <p>Welcome to **YourCart**. Discover standard high-performance technology, home office gear, and daily accessories curated just for you.</p>
        <button className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }} onClick={() => {
          const catalogEl = document.getElementById('products-section');
          if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
        }}>
          Shop Collection
        </button>
      </div>

      {/* Features grid */}
      <div className="features-grid">
        <div className="feature-item">
          <div className="feature-icon"><Truck /></div>
          <div>
            <h4>Free Shipping</h4>
            <p>Complimentary local express shipping on all orders</p>
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-icon"><ShieldCheck /></div>
          <div>
            <h4>Secure Server Checkout</h4>
            <p>Transactions verified with local token authorization</p>
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-icon"><RotateCcw /></div>
          <div>
            <h4>30-Day Replacements</h4>
            <p>Easy returns with automated MongoDB inventory adjustments</p>
          </div>
        </div>
      </div>

      <div id="products-section" style={{ scrollMarginTop: '100px', marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 800, fontSize: '1.75rem' }}>Our Featured Items</h2>
      </div>

      <div className="filter-bar">
        <div className="categories">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-chip ${selectedCategory === cat || (cat === 'All' && !selectedCategory) ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat === 'All' ? '' : cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="search-box">
          <Search className="icon" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search products..."
            className="search-input"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          {searchKeyword && (
            <button
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              onClick={() => setSearchKeyword('')}
            >
              <X className="icon" style={{ width: '1rem', height: '1rem' }} />
            </button>
          )}
        </div>
      </div>

      {loadingProducts ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading catalog items...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-title">No Products Found</p>
          <p className="empty-state-text">We couldn't find any products matching your search terms.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              addToCart={addToCart}
              navigate={navigate}
              getProductImage={getProductImage}
            />
          ))}
        </div>
      )}
    </section>
  );
}
