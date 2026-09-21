import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function MyOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's orders
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if (!userInfo) {
        navigate("/login");
        return;
      }

      const { data } = await API.get("/orders/myorders");
      setOrders(data);
    } catch (error) {
      console.error("Error loading orders:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("userInfo");
        navigate("/login");
      } else {
        alert(
          error.response?.data?.message ||
            "Failed to load orders."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Cancel order
  const cancelOrder = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) return;

    try {
      await API.put(`/orders/${id}/cancel`, {});

      alert("Order cancelled successfully.");
      fetchOrders();
    } catch (error) {
      console.error("Error cancelling order:", error);

      alert(
        error.response?.data?.message ||
          "Failed to cancel order."
      );
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 sm:py-10 lg:py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-5">

          <div className="h-8 w-44 bg-slate-200 rounded-lg animate-pulse mb-7" />

          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 animate-pulse"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                <div className="h-6 w-2/3 sm:w-1/3 bg-slate-200 rounded" />
                <div className="h-6 w-24 bg-slate-200 rounded-full" />
              </div>

              <div className="h-4 w-1/2 bg-slate-200 rounded" />
              <div className="h-12 w-full bg-slate-100 rounded-xl" />
            </div>
          ))}

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans py-8 sm:py-10 lg:py-12">

      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
              My Orders
            </h1>

            <p className="text-slate-500 text-sm mt-1.5 max-w-xl leading-relaxed">
              Track manufacturing progress, delivery statuses, and active orders.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors duration-200 self-start sm:self-auto"
          >
            ← Back to Products
          </Link>

        </div>

        {/* Orders */}
        {orders.length === 0 ? (

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 sm:p-12 text-center max-w-xl mx-auto mt-6">

            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-5">

              <svg
                className="w-7 h-7 sm:w-8 sm:h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>

            </div>

            <h2 className="text-xl font-bold text-slate-950">
              No Orders Found
            </h2>

            <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto leading-relaxed">
              You haven't placed any customization or structural material orders yet.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-flex justify-center items-center bg-slate-950 hover:bg-slate-800 text-white font-semibold px-5 sm:px-6 py-2.5 rounded-xl shadow-sm transition-colors duration-200 text-sm"
            >
              Start Custom Order
            </Link>

          </div>

        ) : (

          <div className="space-y-5 sm:space-y-6">

            {orders.map((order) => {

              // Order status styles
              const statusConfig = {
                Completed: {
                  bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
                  dot: "bg-emerald-500",
                },

                Processing: {
                  bg: "bg-blue-50 text-blue-700 border-blue-200",
                  dot: "bg-blue-500",
                },

                Cancelled: {
                  bg: "bg-rose-50 text-rose-700 border-rose-200",
                  dot: "bg-rose-500",
                },

                Pending: {
                  bg: "bg-amber-50 text-amber-700 border-amber-200",
                  dot: "bg-amber-500",
                },
              };

              const currentStatus =
                statusConfig[order.orderStatus] ||
                statusConfig.Pending;

              return (
                <div
                  key={order._id}
                  className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 sm:p-6 transition-all duration-200 hover:border-slate-300 hover:shadow-md"
                >

                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 pb-5 border-b border-slate-100">

                    <div className="min-w-0">

                      <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wide text-slate-400">
                        Order Reference
                      </span>

                      <h2 className="text-lg sm:text-xl font-bold text-slate-950 mt-1 break-words">
                        {order.product?.productName ||
                          "Product Reference Unavailable"}
                      </h2>

                    </div>

                    {/* Order Status */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border shrink-0 ${currentStatus.bg}`}
                    >

                      <span
                        className={`w-2 h-2 rounded-full ${currentStatus.dot}`}
                      />

                      {order.orderStatus}

                    </span>

                  </div>

                  {/* Order Information */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 py-5 text-sm">

                    {/* Delivery Information */}
                    <div>

                      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Delivery Logistics
                      </h3>

                      <div className="space-y-1">

                        <p className="font-semibold text-slate-800 break-words">
                          {order.customerName}
                        </p>

                        <p className="text-slate-500">
                          {order.phone}
                        </p>

                        <p className="text-slate-500 leading-relaxed max-w-xs break-words">
                          {order.address}
                        </p>

                      </div>

                    </div>

                    {/* Order Details */}
                    <div>

                      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Order Details
                      </h3>

                      <div className="space-y-1 text-slate-600">

                        <p>
                          Quantity:{" "}
                          <span className="font-semibold text-slate-900">
                            {order.quantity} units
                          </span>
                        </p>

                        <p>
                          Order Date:{" "}
                          <span className="font-semibold text-slate-900">
                            {new Date(
                              order.createdAt
                            ).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </p>

                      </div>

                    </div>

                    {/* Estimated Amount */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">

                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Estimated Amount
                      </div>

                      <div className="text-xl sm:text-2xl font-extrabold text-slate-950 tabular-nums mt-1">
                        ₹{order.totalPrice?.toLocaleString("en-IN") || "0"}
                      </div>

                      <p className="text-[11px] text-slate-400 mt-1">
                        Payment is handled separately.
                      </p>

                    </div>

                  </div>

                  {/* Cancel Order */}
                  {(order.orderStatus === "Pending" ||
                    order.orderStatus === "Processing") && (

                    <div className="pt-4 border-t border-slate-100 flex justify-start sm:justify-end">

                      <button
                        onClick={() => cancelOrder(order._id)}
                        className="w-full sm:w-auto text-xs font-semibold text-rose-600 hover:text-rose-700 border border-rose-200 hover:bg-rose-50 px-4 py-2.5 rounded-xl transition-colors duration-200"
                      >
                        Cancel Active Order
                      </button>

                    </div>

                  )}

                </div>
              );
            })}

          </div>

        )}

      </div>

    </div>
  );
}

export default MyOrders;