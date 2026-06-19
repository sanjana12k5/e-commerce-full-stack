import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { User, Product, Order } from './models.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log(`Connected to MongoDB: ${mongoUri}`);
    seedDatabase();
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
  });

// ==========================================
// USERS CRUD ENDPOINTS
// ==========================================

// 1. POST /api/users (Create a new user)
app.post('/api/users', async (req, res) => {
  const { name, email, phone, address } = req.body;
  try {
    if (!name || !email || !phone || !address) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({ name, email, phone, address });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. GET /api/users (Get all users)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. GET /api/users/:id (Get user by ID)
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. PUT /api/users/:id (Update a user)
app.put('/api/users/:id', async (req, res) => {
  const { name, email, phone, address } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = name !== undefined ? name : user.name;
      user.email = email !== undefined ? email : user.email;
      user.phone = phone !== undefined ? phone : user.phone;
      user.address = address !== undefined ? address : user.address;

      const updatedUser = await user.save();
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 5. DELETE /api/users/:id (Delete a user)
app.delete('/api/users/:id', async (req, res) => {
  try {
    const result = await User.deleteOne({ _id: req.params.id });
    if (result.deletedCount > 0) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// PRODUCTS CRUD ENDPOINTS
// ==========================================

// 6. POST /api/products (Create a new product)
app.post('/api/products', async (req, res) => {
  const { name, description, price, quantity, category } = req.body;
  try {
    if (!name || !description || price === undefined || quantity === undefined || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const product = await Product.create({
      name,
      description,
      price,
      quantity,
      category,
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 7. GET /api/products (Get all products)
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 8. GET /api/products/:id (Get product by ID)
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 9. PUT /api/products/:id (Update a product)
app.put('/api/products/:id', async (req, res) => {
  const { name, description, price, quantity, category } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = name !== undefined ? name : product.name;
      product.description = description !== undefined ? description : product.description;
      product.price = price !== undefined ? price : product.price;
      product.quantity = quantity !== undefined ? quantity : product.quantity;
      product.category = category !== undefined ? category : product.category;

      const updatedProduct = await product.save();
      res.status(200).json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 10. DELETE /api/products/:id (Delete a product)
app.delete('/api/products/:id', async (req, res) => {
  try {
    const result = await Product.deleteOne({ _id: req.params.id });
    if (result.deletedCount > 0) {
      res.status(200).json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// ORDERS CRUD ENDPOINTS
// ==========================================

// 11. POST /api/orders (Create a new order + deduct stock)
app.post('/api/orders', async (req, res) => {
  const { userId, products, totalAmount, status } = req.body;
  try {
    if (!userId || !products || products.length === 0 || totalAmount === undefined) {
      return res.status(400).json({ message: 'userId, products, and totalAmount are required' });
    }

    // Verify and deduct stock
    for (const item of products) {
      const dbProduct = await Product.findById(item.productId);
      if (!dbProduct) {
        return res.status(404).json({ message: `Product not found` });
      }
      if (dbProduct.quantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${dbProduct.name}` });
      }
    }

    // Process deductions
    for (const item of products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.quantity },
      });
    }

    const order = await Order.create({
      userId,
      products,
      totalAmount,
      status: status || 'pending',
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('userId', 'name email')
      .populate('products.productId', 'name');

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 12. GET /api/orders (Get all orders)
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('userId', 'name email phone address')
      .populate('products.productId', 'name price category')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 13. GET /api/orders/:id (Get order by ID)
app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email phone address')
      .populate('products.productId', 'name price category');
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 14. PUT /api/orders/:id (Update an order)
app.put('/api/orders/:id', async (req, res) => {
  const { status, totalAmount, products } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = status !== undefined ? status : order.status;
      order.totalAmount = totalAmount !== undefined ? totalAmount : order.totalAmount;
      if (products !== undefined) {
        order.products = products;
      }

      const updatedOrder = await order.save();
      res.status(200).json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 15. DELETE /api/orders/:id (Delete an order + refund stock)
app.delete('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      // Refund items to stock
      for (const item of order.products) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { quantity: item.quantity },
        });
      }

      await Order.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: 'Order deleted successfully' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// SEED DATABASE FUNCTION
// ==========================================
async function seedDatabase() {
  try {
    // Detect and wipe legacy schemas once for new format compatibility
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    let hasLegacyData = false;
    if (collectionNames.includes('users')) {
      const legacyUser = await mongoose.connection.db.collection('users').findOne({ password: { $exists: true } });
      if (legacyUser) hasLegacyData = true;
    }
    if (collectionNames.includes('products')) {
      const legacyProd = await mongoose.connection.db.collection('products').findOne({ countInStock: { $exists: true } });
      if (legacyProd) hasLegacyData = true;
    }
    if (collectionNames.includes('orders')) {
      const legacyOrder = await mongoose.connection.db.collection('orders').findOne({ totalPrice: { $exists: true } });
      if (legacyOrder) hasLegacyData = true;
    }

    if (hasLegacyData) {
      console.log('Legacy database schema detected. Wiping collections for MERN CRUD compatibility...');
      await User.deleteMany({});
      await Product.deleteMany({});
      await Order.deleteMany({});
    }

    // 1. Seed Users
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('No users found. Seeding default accounts...');
      await User.create([
        {
          name: 'Regular Customer',
          email: 'user@yourcart.com',
          phone: '9876543210',
          address: '123 E-Commerce Shop Ave, NY 10001',
        },
        {
          name: 'Store Manager',
          email: 'admin@yourcart.com',
          phone: '9876543211',
          address: '55 Manager HQ Boulevard, NY 10002',
        },
      ]);
      console.log('Seeded accounts:');
      console.log('  Customer: user@yourcart.com');
      console.log('  Admin   : admin@yourcart.com');
    }

    // 2. Seed Products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('No products found. Seeding initial e-commerce items...');
      await Product.create([
        {
          name: 'Ultralight Gaming Mouse',
          description: 'A 58-gram gaming mouse with an optical sensor up to 26K DPI, dynamic RGB lighting, and lag-free wireless response.',
          price: 79.99,
          quantity: 25,
          category: 'Electronics',
        },
        {
          name: 'Mechanical RGB Keyboard',
          description: 'Hot-swappable tactile switches, double-shot PBT keycaps, sound-dampening foam, and full per-key RGB personalization.',
          price: 129.99,
          quantity: 15,
          category: 'Electronics',
        },
        {
          name: 'Active Noise Cancelling Headphones',
          description: 'Premium wireless headphones with hybrid active noise cancellation, high-fidelity audio, and up to 40 hours of battery life.',
          price: 249.99,
          quantity: 8,
          category: 'Electronics',
        },
        {
          name: 'Ergonomic Memory Foam Chair',
          description: 'A high-back office chair with adjustable 3D armrests, lumbar support, and memory foam padding for maximum comfort.',
          price: 189.99,
          quantity: 5,
          category: 'Office',
        },
        {
          name: 'Double-Walled Steel Flask',
          description: 'Keeps beverages hot for 12 hours or ice-cold for 24 hours. Leak-proof cap, rust-resistant grade stainless steel.',
          price: 34.99,
          quantity: 50,
          category: 'Home',
        },
        {
          name: 'Leather Minimalist Wallet',
          description: 'Slim bi-fold wallet made from premium full-grain leather, featuring RFID blocking slots for up to 8 credit cards.',
          price: 45.00,
          quantity: 12,
          category: 'Accessories',
        },
      ]);
      console.log('Seeded 6 sample products.');
    }
  } catch (error) {
    console.error('Seeding database failed:', error);
  }
}

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
