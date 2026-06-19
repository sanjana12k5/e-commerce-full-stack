import { useState, useEffect } from 'react';
import { api } from './api';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';

// Pages
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  // ==========================================
  // Application State
  // ==========================================

  // Theme State
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  // Authentication State
  const [userInfo, setUserInfo] = useState(() => {
    const savedUser = localStorage.getItem('userInfo');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Cart State
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Router State
  // Pages: 'catalog', 'detail', 'cart', 'checkout', 'orders', 'order-detail', 'login', 'register', 'admin'
  const [currentPage, setCurrentPage] = useState('catalog');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);

  // App Global Data State
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Search & Filters State
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories] = useState(['All', 'Electronics', 'Office', 'Home', 'Accessories']);

  // Detail View State
  const [detailProduct, setDetailProduct] = useState(null);
  const [detailQty, setDetailQty] = useState(1);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Order Flow State
  const [myOrders, setMyOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Admin Dashboard State
  const [adminTab, setAdminTab] = useState('stats');
  const [allOrders, setAllOrders] = useState([]);
  const [loadingAllOrders, setLoadingAllOrders] = useState(false);

  // Admin Products State
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    description: '',
    quantity: 10,
    category: 'Electronics'
  });

  // Admin Users CRUD State
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Auth Input States
  const [loginEmail, setLoginEmail] = useState('');
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Notifications (Toast) State
  const [toasts, setToasts] = useState([]);

  // ==========================================
  // Side Effects
  // ==========================================

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (userInfo) {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    } else {
      localStorage.removeItem('userInfo');
    }
  }, [userInfo]);

  useEffect(() => {
    if (currentPage === 'catalog') {
      fetchCatalogProducts();
    }
  }, [currentPage, selectedCategory, searchKeyword]);

  useEffect(() => {
    if (currentPage === 'detail' && selectedProductId) {
      fetchSingleProductDetails(selectedProductId);
    }
  }, [currentPage, selectedProductId]);

  useEffect(() => {
    if (currentPage === 'orders' && userInfo) {
      fetchMyOrdersHistory();
    }
  }, [currentPage, userInfo]);

  useEffect(() => {
    if (currentPage === 'order-detail' && selectedOrderId) {
      fetchSpecificOrderDetails(selectedOrderId);
    }
  }, [currentPage, selectedOrderId]);

  useEffect(() => {
    if (currentPage === 'admin' && userInfo?.isAdmin) {
      if (adminTab === 'orders') {
        fetchAdminOrders();
      } else if (adminTab === 'users') {
        fetchAdminUsers();
      } else if (adminTab === 'products' || adminTab === 'stats') {
        fetchCatalogProducts();
        if (adminTab === 'stats') {
          fetchAdminOrders();
          fetchAdminUsers();
        }
      }
    }
  }, [currentPage, adminTab]);

  // ==========================================
  // Dynamic Product Image Generator
  // ==========================================
  const getProductImage = (product) => {
    const cat = product.category ? product.category.toLowerCase() : '';
    if (cat.includes('elect')) {
      return 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=60';
    } else if (cat.includes('off') || cat.includes('chair') || cat.includes('desk')) {
      return 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&auto=format&fit=crop&q=60';
    } else if (cat.includes('home') || cat.includes('flask') || cat.includes('bottle')) {
      return 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=60';
    } else if (cat.includes('acc') || cat.includes('wall')) {
      return 'https://images.unsplash.com/photo-1627124118123-ab43afaf87a1?w=600&auto=format&fit=crop&q=60';
    }
    return 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=60';
  };

  // ==========================================
  // Operations & Actions
  // ==========================================

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const navigate = (page, extra = {}) => {
    setCurrentPage(page);
    if (extra.productId) {
      setSelectedProductId(extra.productId);
      setDetailQty(1);
    }
    if (extra.orderId) {
      setSelectedOrderId(extra.orderId);
      setSelectedOrderDetails(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Operations
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const list = await api.getUsers();
      const match = list.find((u) => u.email.toLowerCase() === loginEmail.toLowerCase().trim());

      if (match) {
        const isAdmin = match.email.toLowerCase().includes('admin');
        const sessionUser = { ...match, isAdmin };

        setUserInfo(sessionUser);
        showToast(`Logged in successfully! Welcome back, ${match.name}.`);
        setLoginEmail('');
        if (sessionUser.isAdmin) {
          navigate('admin');
        } else {
          navigate('catalog');
        }
      } else {
        showToast('Email not registered. Please create a new account!', 'error');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const created = await api.createUser(registerForm);
      const isAdmin = created.email.toLowerCase().includes('admin');
      const sessionUser = { ...created, isAdmin };

      setUserInfo(sessionUser);
      showToast(`Account successfully created! Welcome, ${created.name}.`);
      setRegisterForm({ name: '', email: '', phone: '', address: '' });
      if (sessionUser.isAdmin) {
        navigate('admin');
      } else {
        navigate('catalog');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleLogout = () => {
    setUserInfo(null);
    setCartItems([]);
    showToast('Logged out successfully.');
    navigate('catalog');
  };

  // Fetching Data
  const fetchCatalogProducts = async () => {
    setLoadingProducts(true);
    try {
      const data = await api.getProducts();
      const filtered = data.filter((p) => {
        const matchesKeyword = searchKeyword
          ? p.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          p.description.toLowerCase().includes(searchKeyword.toLowerCase())
          : true;
        const matchesCategory = selectedCategory && selectedCategory !== 'All'
          ? p.category.toLowerCase() === selectedCategory.toLowerCase()
          : true;
        return matchesKeyword && matchesCategory;
      });
      setProducts(filtered);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchSingleProductDetails = async (id) => {
    setLoadingDetail(true);
    try {
      const data = await api.getProductDetails(id);
      setDetailProduct(data);
    } catch (err) {
      showToast(err.message, 'error');
      navigate('catalog');
    } finally {
      setLoadingDetail(false);
    }
  };

  const fetchMyOrdersHistory = async () => {
    setLoadingOrders(true);
    try {
      const data = await api.getAllOrders();
      const filtered = data.filter((o) => {
        const orderUserId = o.userId?._id || o.userId;
        return orderUserId === userInfo?._id;
      });
      setMyOrders(filtered);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchSpecificOrderDetails = async (id) => {
    setLoadingOrderDetails(true);
    try {
      const order = await api.getOrderById(id);
      setSelectedOrderDetails(order);
    } catch (err) {
      showToast(err.message, 'error');
      navigate('orders');
    } finally {
      setLoadingOrderDetails(false);
    }
  };

  const fetchAdminOrders = async () => {
    setLoadingAllOrders(true);
    try {
      const data = await api.getAllOrders();
      setAllOrders(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoadingAllOrders(false);
    }
  };

  const fetchAdminUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await api.getUsers();
      setUsersList(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoadingUsers(false);
    }
  };

  // Cart operations
  const addToCart = (product, qty = 1) => {
    if (product.quantity === 0) {
      showToast('Sorry, this product is out of stock.', 'error');
      return;
    }

    setCartItems((prevItems) => {
      const exists = prevItems.find((item) => item.product === product._id);
      if (exists) {
        const newQty = exists.qty + qty;
        if (newQty > product.quantity) {
          showToast(`Cannot add more. Limit reached (Max: ${product.quantity}).`, 'error');
          return prevItems;
        }
        showToast(`Updated cart quantity for ${product.name}.`);
        return prevItems.map((item) =>
          item.product === product._id ? { ...item, qty: newQty } : item
        );
      } else {
        showToast(`Added ${product.name} to cart.`);
        return [
          ...prevItems,
          {
            product: product._id,
            name: product.name,
            price: product.price,
            category: product.category,
            qty: qty,
            quantity: product.quantity,
          },
        ];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product !== productId));
    showToast('Item removed from cart.');
  };

  const adjustQty = (productId, delta) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product === productId) {
          const newQty = item.qty + delta;
          if (newQty >= 1 && newQty <= item.quantity) {
            return { ...item, qty: newQty };
          }
        }
        return item;
      })
    );
  };

  const getCartSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      showToast('Session error, please log in.', 'error');
      return;
    }

    try {
      const orderPayload = {
        userId: userInfo._id,
        products: cartItems.map((item) => ({
          productId: item.product,
          quantity: item.qty,
          price: item.price,
        })),
        totalAmount: parseFloat(getCartSubtotal()),
        status: 'pending',
      };

      await api.createOrder(orderPayload);
      showToast('Order successfully placed!');
      setCartItems([]);
      navigate('orders');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Admin Catalog CRUD
  const handleOpenAddProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      price: 0,
      description: '',
      quantity: 10,
      category: 'Electronics',
    });
    setShowProductModal(true);
  };

  const handleOpenEditProductModal = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price,
      description: product.description,
      quantity: product.quantity,
      category: product.category,
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const updated = await api.updateProduct(editingProduct._id, productForm);
        showToast(`Successfully updated product: ${updated.name}`);
      } else {
        const created = await api.createProduct(productForm);
        showToast(`Successfully created product: ${created.name}`);
      }
      setShowProductModal(false);
      fetchCatalogProducts();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.deleteProduct(id);
        showToast('Product successfully deleted.');
        fetchCatalogProducts();
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  };

  // Admin Orders CRUD
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrder(orderId, { status: newStatus });
      showToast(`Order status updated to ${newStatus}`);
      fetchAdminOrders();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order? This will refund items back to stock.')) {
      try {
        await api.deleteOrder(orderId);
        showToast('Order deleted successfully.');
        fetchAdminOrders();
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  };

  // Admin Users CRUD
  const handleOpenAddUserModal = () => {
    setEditingUser(null);
    setUserForm({
      name: '',
      email: '',
      phone: '',
      address: ''
    });
    setShowUserModal(true);
  };

  const handleOpenEditUserModal = (user) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address
    });
    setShowUserModal(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const updated = await api.updateUser(editingUser._id, userForm);
        showToast(`Successfully updated profile: ${updated.name}`);
        // If editing current user, update session state
        if (editingUser._id === userInfo?._id) {
          const isAdmin = updated.email.toLowerCase().includes('admin');
          setUserInfo({ ...updated, isAdmin });
        }
      } else {
        const created = await api.createUser(userForm);
        showToast(`Successfully registered user: ${created.name}`);
      }
      setShowUserModal(false);
      fetchAdminUsers();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteUser = async (id) => {
    if (id === userInfo?._id) {
      showToast('Cannot delete your own active session!', 'error');
      return;
    }
    if (window.confirm('Are you sure you want to delete this user profile?')) {
      try {
        await api.deleteUser(id);
        showToast('User deleted successfully.');
        fetchAdminUsers();
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  };

  // Client-Side stats
  const calculateAdminStats = () => {
    const totalSales = allOrders.reduce((acc, o) => acc + o.totalAmount, 0);
    const ordersCount = allOrders.length;
    const itemsCount = products.length;
    const activeUsers = usersList.length;

    return {
      revenue: totalSales.toFixed(2),
      orders: ordersCount,
      catalog: itemsCount,
      users: activeUsers,
    };
  };

  const stats = calculateAdminStats();

  // ==========================================
  // Render
  // ==========================================

  return (
    <div className={`app-container ${darkMode ? 'dark-theme' : 'light-theme'}`}>

      <Toast toasts={toasts} />

      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        currentPage={currentPage}
        navigate={navigate}
        cartItems={cartItems}
        userInfo={userInfo}
        handleLogout={handleLogout}
      />

      <main className="main-content">

        {currentPage === 'catalog' && (
          <CatalogPage
            products={products}
            loadingProducts={loadingProducts}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            navigate={navigate}
            addToCart={addToCart}
            getProductImage={getProductImage}
          />
        )}

        {currentPage === 'detail' && (
          <ProductDetailPage
            detailProduct={detailProduct}
            loadingDetail={loadingDetail}
            detailQty={detailQty}
            setDetailQty={setDetailQty}
            navigate={navigate}
            addToCart={addToCart}
            getProductImage={getProductImage}
          />
        )}

        {currentPage === 'cart' && (
          <CartPage
            cartItems={cartItems}
            adjustQty={adjustQty}
            removeFromCart={removeFromCart}
            navigate={navigate}
            userInfo={userInfo}
            getCartSubtotal={getCartSubtotal}
            getProductImage={getProductImage}
            showToast={showToast}
          />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage
            userInfo={userInfo}
            cartItems={cartItems}
            getCartSubtotal={getCartSubtotal}
            handlePlaceOrder={handlePlaceOrder}
          />
        )}

        {currentPage === 'orders' && (
          <OrdersPage
            myOrders={myOrders}
            loadingOrders={loadingOrders}
            navigate={navigate}
          />
        )}

        {currentPage === 'order-detail' && (
          <OrderDetailPage
            selectedOrderDetails={selectedOrderDetails}
            loadingOrderDetails={loadingOrderDetails}
            navigate={navigate}
          />
        )}

        {currentPage === 'login' && (
          <LoginPage
            loginEmail={loginEmail}
            setLoginEmail={setLoginEmail}
            handleLogin={handleLogin}
            navigate={navigate}
          />
        )}

        {currentPage === 'register' && (
          <RegisterPage
            registerForm={registerForm}
            setRegisterForm={setRegisterForm}
            handleRegister={handleRegister}
            navigate={navigate}
          />
        )}

        {currentPage === 'admin' && userInfo?.isAdmin && (
          <AdminPage
            adminTab={adminTab}
            setAdminTab={setAdminTab}
            stats={stats}
            products={products}
            loadingProducts={loadingProducts}
            getProductImage={getProductImage}
            showProductModal={showProductModal}
            setShowProductModal={setShowProductModal}
            editingProduct={editingProduct}
            productForm={productForm}
            setProductForm={setProductForm}
            handleOpenAddProductModal={handleOpenAddProductModal}
            handleOpenEditProductModal={handleOpenEditProductModal}
            handleSaveProduct={handleSaveProduct}
            handleDeleteProduct={handleDeleteProduct}
            allOrders={allOrders}
            loadingAllOrders={loadingAllOrders}
            handleUpdateOrderStatus={handleUpdateOrderStatus}
            handleDeleteOrder={handleDeleteOrder}
            usersList={usersList}
            loadingUsers={loadingUsers}
            userInfo={userInfo}
            showUserModal={showUserModal}
            setShowUserModal={setShowUserModal}
            editingUser={editingUser}
            userForm={userForm}
            setUserForm={setUserForm}
            handleOpenAddUserModal={handleOpenAddUserModal}
            handleOpenEditUserModal={handleOpenEditUserModal}
            handleSaveUser={handleSaveUser}
            handleDeleteUser={handleDeleteUser}
          />
        )}

      </main>

      <Footer navigate={navigate} userInfo={userInfo} />
    </div>
  );
}
