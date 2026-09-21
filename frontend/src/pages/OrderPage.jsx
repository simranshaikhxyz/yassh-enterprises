import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function OrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    customerName: JSON.parse(localStorage.getItem("userInfo"))?.name || "",
    phone: "",
    address: "",
    quantity: 1,
  });

  const [errors, setErrors] = useState({});

  const fetchProduct = useCallback(async () => {
    try {
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
    } catch (error) {
      console.error("Failed to load product:", error);
      alert("Failed to load product details.");
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const validate = () => {
    let newErrors = {};

    // Name Validation
    if (!formData.customerName.trim()) {
      newErrors.customerName = "Customer name is required.";
    } else if (formData.customerName.trim().length < 3) {
      newErrors.customerName = "Name must be at least 3 characters.";
    }

    // Phone Validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit mobile number.";
    }

    // Address Validation
    if (!formData.address.trim()) {
      newErrors.address = "Delivery address is required.";
    } else if (formData.address.trim().length < 10) {
      newErrors.address = "Address should be at least 10 characters.";
    }

    // Quantity Validation
    if (!formData.quantity || Number(formData.quantity) < 1) {
      newErrors.quantity = "Quantity should be at least 1.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "address") {
      e.target.style.height = "auto";
      e.target.style.height = `${e.target.scrollHeight}px`;
    }

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if (!userInfo) {
        alert("Please login first.");
        navigate("/login");
        return;
      }

      // Authorization header is automatically attached by API interceptor in api.js
      await API.post("/orders", {
        customerName: formData.customerName.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        quantity: Number(formData.quantity),
        product: product._id,
        totalPrice: product.price * Number(formData.quantity),
      });

      alert("Order placed successfully!");
      navigate("/myorders");
    } catch (error) {
      console.error("Order placement error:", error);

      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("userInfo");
        navigate("/login");
      } else {
        alert(
          error.response?.data?.message || "Failed to place order."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Modern Checkout Skeleton
  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-12 px-6 animate-pulse">
        <div className="max-w-5xl mx-auto">
          <div className="h-6 w-32 bg-slate-200 rounded mb-8" />
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-5 h-[400px] bg-slate-200 rounded-2xl" />
            <div className="md:col-span-7 h-[400px] bg-white border border-slate-100 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // Live order calculations
  const parsedQuantity = Math.max(1, parseInt(formData.quantity) || 0);
  const calculatedTotal = product.price * parsedQuantity;

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 antialiased font-sans py-12">
      <div className="max-w-5xl mx-auto px-6">

        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            to={`/products/${product._id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Specifications
          </Link>
        </div>

        {/* Form & Overview Grid Layout */}
        <div className="grid md:grid-cols-12 gap-8 items-start">

          {/* Left Column: Dynamic Product & Pricing Summary (Sticky) */}
          <div className="md:col-span-5 bg-white border border-slate-150 rounded-2xl p-6 shadow-sm space-y-6 md:sticky md:top-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                Selected Item
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-3">
                {product.productName}
              </h2>
            </div>

            <img
              src={
                product.image || "https://via.placeholder.com/600x350?text=Metal+Product"
              }
              alt={product.productName}
              className="w-full h-44 object-cover rounded-xl border border-slate-100"
            />

            {/* Calculations Breakdown card */}
            <div className="bg-slate-50 border border-slate-100/80 rounded-xl p-4 space-y-3 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Unit Price</span>
                <span className="font-semibold text-slate-850">₹{product.price?.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Quantity Requested</span>
                <span className="font-semibold text-slate-850">{parsedQuantity} units</span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between items-end">
                <span className="font-semibold text-slate-900">Total Valuation</span>
                <span className="text-2xl font-black text-indigo-650 tracking-tight tabular-nums">
                  ₹{calculatedTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Checkout Delivery Form */}
          <div className="md:col-span-7 bg-white border border-slate-150 rounded-2xl p-8 shadow-sm">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Order Placement
              </h1>
              <p className="text-slate-400 text-xs mt-1">
                Fill in the verified delivery coordinates below to request custom fabrication schedules.
              </p>
            </div>

            <form onSubmit={placeOrder} className="space-y-5 mt-8">
              {/* Customer Name */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Customer / Business Name
                </label>
                <input
                  type="text"
                  name="customerName"
                  placeholder="e.g. Raman Chawla"
                  value={formData.customerName}
                  onChange={handleChange}
                  className={`w-full border rounded-xl p-3 text-sm transition-all outline-none resize-none focus:ring-4 ${errors.customerName
                    ? "border-rose-300 focus:border-rose-400 focus:ring-rose-500/10"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10"
                    }`}
                />
                {errors.customerName && (
                  <p className="text-rose-600 text-xs font-semibold mt-1.5 flex items-center gap-1">
                    ⚠️ {errors.customerName}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Primary Mobile Number
                </label>
                <input
                  type="text"
                  name="phone"
                  placeholder="10-digit number (e.g. 9876543210)"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full border rounded-xl p-3 text-sm transition-all outline-none focus:ring-4 ${errors.phone
                    ? "border-rose-300 focus:border-rose-400 focus:ring-rose-500/10"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10"
                    }`}
                />
                {errors.phone && (
                  <p className="text-rose-600 text-xs font-semibold mt-1.5 flex items-center gap-1">
                    ⚠️ {errors.phone}
                  </p>
                )}
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Structural Delivery Address
                </label>
                <textarea
                  name="address"
                  rows="3"
                  style={{ resize: "none", overflow: "hidden" }}
                  placeholder="Full structural destination address (Min. 10 chars)"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full border rounded-xl p-3 text-sm transition-all outline-none focus:ring-4 ${errors.address
                    ? "border-rose-300 focus:border-rose-400 focus:ring-rose-500/10"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10"
                    }`}
                />
                {errors.address && (
                  <p className="text-rose-600 text-xs font-semibold mt-1.5 flex items-center gap-1">
                    ⚠️ {errors.address}
                  </p>
                )}
              </div>

              {/* Order Quantity */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Order Volume / Units
                </label>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  className={`w-full border rounded-xl p-3 text-sm transition-all outline-none focus:ring-4 ${errors.quantity
                    ? "border-rose-300 focus:border-rose-400 focus:ring-rose-500/10"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10"
                    }`}
                />
                {errors.quantity && (
                  <p className="text-rose-600 text-xs font-semibold mt-1.5 flex items-center gap-1">
                    ⚠️ {errors.quantity}
                  </p>
                )}
              </div>

              {/* Submission CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-350 text-white font-bold py-4 rounded-xl shadow-md transition duration-150 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Executing Order Booking...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Confirm & Place Custom Order
                  </>
                )}
              </button>

            </form>
          </div>

        </div>

      </div>
    </div>
  );
}

export default OrderPage;