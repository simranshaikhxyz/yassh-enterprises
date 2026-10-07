import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";

import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import OrderPage from "./pages/OrderPage";
import MyOrders from "./pages/MyOrders";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import ForgotPassword from "./pages/ForgotPassword";

import AdminDashboard from "./admin/pages/AdminDashboard";
import AddProduct from "./admin/pages/AddProduct";
import ManageProducts from "./admin/pages/ManageProducts";
import ManageOrders from "./admin/pages/ManageOrders";
import Reports from "./admin/pages/Reports";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 selection:bg-indigo-500 selection:text-white">

      {/* Automatically scroll to top whenever the page changes */}
      <ScrollToTop />

      {/* Navigation Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-grow">
        <Routes>

          {/* Public & Customer Routes */}
          <Route path="/" element={<Home />} />
      
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/products/:id/order" element={<OrderPage />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Admin Back-Office Routes */}
          <Route path="/admin" element={<AdminDashboard />} />

          <Route
            path="/admin/add-product"
            element={<AddProduct />}
          />

          <Route
            path="/admin/edit-product/:id"
            element={<AddProduct />}
          />

          <Route
            path="/admin/products"
            element={<ManageProducts />}
          />

          <Route
            path="/admin/orders"
            element={<ManageOrders />}
          />

          <Route
            path="/admin/reports"
            element={<Reports />}
          />

        </Routes>
      </main>

      {/* Site Footer */}
      <Footer />

    </div>
  );
}

export default App;