// Dynamic API Client for SwiftKart MERN Stack CRUD API

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    const errorMsg = data && data.message ? data.message : 'Something went wrong';
    throw new Error(errorMsg);
  }
  return data;
};

export const api = {
  // ==========================================
  // USERS ENDPOINTS
  // ==========================================
  
  // 1. Create a new user (used for registration)
  createUser: async (userData) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData), // { name, email, phone, address }
    });
    return handleResponse(response);
  },

  // 2. Get all users (used to find login profile match)
  getUsers: async () => {
    const response = await fetch('/api/users', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(response);
  },

  // 3. Get a user by ID
  getUserById: async (id) => {
    const response = await fetch(`/api/users/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(response);
  },

  // 4. Update a user
  updateUser: async (id, userData) => {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // 5. Delete a user
  deleteUser: async (id) => {
    const response = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(response);
  },

  // ==========================================
  // PRODUCTS ENDPOINTS
  // ==========================================

  // 6. Get all products
  getProducts: async () => {
    const response = await fetch('/api/products', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(response);
  },

  // 7. Get a product by ID
  getProductDetails: async (id) => {
    const response = await fetch(`/api/products/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(response);
  },

  // 8. Create a new product
  createProduct: async (productData) => {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData), // { name, description, price, quantity, category }
    });
    return handleResponse(response);
  },

  // 9. Update an existing product
  updateProduct: async (id, productData) => {
    const response = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    return handleResponse(response);
  },

  // 10. Delete a product
  deleteProduct: async (id) => {
    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(response);
  },

  // ==========================================
  // ORDERS ENDPOINTS
  // ==========================================

  // 11. Create a new order
  createOrder: async (orderData) => {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData), 
      // { userId, products: [{ productId, quantity, price }], totalAmount, status }
    });
    return handleResponse(response);
  },

  // 12. Get all orders
  getAllOrders: async () => {
    const response = await fetch('/api/orders', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(response);
  },

  // 13. Get an order by ID
  getOrderById: async (id) => {
    const response = await fetch(`/api/orders/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(response);
  },

  // 14. Update an order (change status, etc.)
  updateOrder: async (id, orderData) => {
    const response = await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData), // { status, totalAmount, products }
    });
    return handleResponse(response);
  },

  // 15. Delete an order (refunds stock)
  deleteOrder: async (id) => {
    const response = await fetch(`/api/orders/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(response);
  },
};
