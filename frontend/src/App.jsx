
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

/* Privacy Policy — defined in this file */
function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <article className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <h1 className="text-3xl font-bold text-slate-900">
          Privacy Policy
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          YASSH ENTERPRISES · Last updated October 2026
        </p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-slate-600">
          <section>
            <h2 className="text-lg font-bold text-slate-900">
              1. Information We Collect
            </h2>
            <p>
              We may collect your name, email address, phone number, account
              information, delivery details, order information, and product
              customization requirements when you register, contact us, or
              place an order through our website.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900">
              2. How We Use Your Information
            </h2>
            <p>
              We use this information to manage customer accounts, verify
              email addresses using one-time passwords (OTPs), respond to
              enquiries, manage orders, discuss customized products, arrange
              deliveries, provide customer support, and maintain website
              security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900">
              3. Passwords and Email Verification
            </h2>
            <p>
              Account passwords are processed for secure storage. OTPs are
              used for email verification, and verification emails may be sent
              through Google's Gmail API. Keep your passwords and OTPs private.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900">
              4. Sharing of Information
            </h2>
            <p>
              We do not sell personal information. Relevant information may
              be shared with service providers when necessary for website
              operations, email delivery, order fulfilment, delivery, or
              compliance with legal obligations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900">
              5. Data Security and Retention
            </h2>
            <p>
              We take reasonable measures to protect personal information.
              Information may be retained as necessary for account management,
              orders, security, business operations, and legal requirements.
              No online system can guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900">
              6. Your Privacy Requests
            </h2>
            <p>
              You may contact us to request access to, correction of, or
              deletion of your personal information, subject to applicable
              legal and business requirements.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900">
              7. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy when our practices or legal
              obligations change. The latest version will be published on
              this page.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900">
              8. Contact Us
            </h2>
            <p>
              For privacy-related questions or requests, please contact
              YASSH ENTERPRISES through our Contact page.
            </p>
            <a
              href="/contact"
              className="font-semibold text-indigo-600 hover:underline"
            >
              Contact YASSH ENTERPRISES
            </a>
          </section>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-5">
          <a
            href="/"
            className="font-semibold text-indigo-600 hover:underline"
          >
            Return to Home
          </a>
        </div>
      </article>
    </div>
  );
}

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50 selection:bg-indigo-500 selection:text-white">
      <ScrollToTop />

      <Header />

      <main className="flex-grow">
        <Routes>
          {/* Public and Customer Routes */}
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

          {/* Privacy Policy */}
          <Route
            path="/privacy-policy"
            element={<PrivacyPolicy />}
          />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/add-product" element={<AddProduct />} />
          <Route
            path="/admin/edit-product/:id"
            element={<AddProduct />}
          />
          <Route path="/admin/products" element={<ManageProducts />} />
          <Route path="/admin/orders" element={<ManageOrders />} />
          <Route path="/admin/reports" element={<Reports />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;