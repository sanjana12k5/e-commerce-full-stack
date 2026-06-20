# SwiftKart - Modern Full-Stack E-commerce Web Application

SwiftKart is a modern, light-weight, and complete full-stack e-commerce project. It features user authentication, product catalogs, shopping carts, billing checkout forms, order histories, and a built-in admin panel dashboard.

---

## 🔑 Testing Credentials

The system automatically seeds the following test accounts on first startup. You can use these accounts to verify regular customer and manager/admin functionalities.

### 1. Regular Customer Account
* **Email**: `user@swiftkart.com`
* **Password**: `user123`

### 2. Store Admin / Manager Account
* **Email**: `admin@swiftkart.com`
* **Password**: `admin123`

---

## 🚀 How to Run the Project Locally

Please ensure you have Node.js and MongoDB installed and running on `localhost:27017` on your local system.

### Step 1: Start the Express Backend Server
1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the server in development mode:
   ```bash
   npm run dev
   ```
The backend will launch at `http://localhost:5000` and automatically connect to MongoDB.

### Step 2: Start the Vite React Frontend
1. Open a second terminal in the root project directory:
   ```bash
   # Keep the first server terminal running, open a new one
   npm install
   ```
2. Run the Vite development server:
   ```bash
   npm run dev
   ```
The frontend will launch at `http://localhost:5173`. Open this URL in your web browser to browse and test the store!
