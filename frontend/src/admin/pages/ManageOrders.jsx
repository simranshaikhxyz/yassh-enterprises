import { useEffect, useState } from "react";
import API from "../../services/api";

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get("/orders");
      setOrders(data || []);
    } catch (error) {
      console.error("Fetch Orders Error:", error);
      alert(error.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    // Optimistic state update for instant UI feedback
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === id ? { ...order, orderStatus: status } : order
      )
    );

    try {
      await API.put(`/orders/${id}`, { orderStatus: status });
    } catch (error) {
      console.error("Update Status Error:", error);
      alert(error.response?.data?.message || "Failed to update status");
      // Revert changes on error
      fetchOrders();
    }
  };

  const viewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-100";
      case "Processing":
        return "bg-blue-50 text-blue-700 border-blue-200 focus:ring-blue-100";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200 focus:ring-rose-100";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200 focus:ring-amber-100";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <h1 className="text-lg font-medium text-slate-600 animate-pulse">
          Loading Orders...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 antialiased font-sans py-10">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Manage Orders
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track customer updates, monitor transaction amounts, and manage order statuses.
          </p>
        </div>

        {/* Orders Table Container */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold">
                <tr>
                  <th className="p-5">Customer</th>
                  <th className="p-5">Phone</th>
                  <th className="p-5">Product</th>
                  <th className="p-5">Quantity</th>
                  <th className="p-5">Total</th>
                  <th className="p-5">Status</th>
                  <th className="p-5 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-16 text-slate-400 font-medium"
                    >
                      No orders found in the database.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-slate-50/30 transition-colors"
                    >
                      {/* Customer Name */}
                      <td className="p-5 font-semibold text-slate-900">
                        {order.customerName || order.user?.name || "Guest Customer"}
                      </td>

                      {/* Phone */}
                      <td className="p-5 text-slate-500 font-medium tabular-nums">
                        {order.phone || "—"}
                      </td>

                      {/* Product Name */}
                      <td className="p-5 text-slate-600 max-w-xs truncate">
                        {order.product?.productName || (
                          <span className="text-rose-500 italic text-xs bg-rose-50 px-2 py-0.5 rounded">
                            Deleted Product
                          </span>
                        )}
                      </td>

                      {/* Quantity */}
                      <td className="p-5 text-slate-500 font-medium tabular-nums">
                        {order.quantity || 1}
                      </td>

                      {/* Total Price */}
                      <td className="p-5 font-bold text-slate-900 tabular-nums">
                        ₹{(order.totalPrice || 0).toLocaleString("en-IN")}
                      </td>

                      {/* Dynamic Dropdown Status Selector */}
                      <td className="p-5">
                        <select
                          value={order.orderStatus || "Pending"}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-full border bg-white focus:outline-none focus:ring-2 cursor-pointer transition-all duration-150 ${getStatusClasses(
                            order.orderStatus
                          )}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="p-5 text-center">
                        <button
                          type="button"
                          onClick={() => viewOrder(order)}
                          className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition font-medium text-xs shadow-sm"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Sheet Backdrop */}
        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-all">
            
            {/* Modal Body Container */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
              
              {/* Modal Head */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Order Receipt
                  </h2>
                  <p className="text-slate-400 text-xs mt-0.5">
                    ID: {selectedOrder._id}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content Scroll Body */}
              <div className="p-6 space-y-6 overflow-y-auto text-sm">
                
                {/* Section 1: Customer Profile */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                    Customer Info
                  </h3>
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 space-y-2.5">
                    <div className="flex justify-between"><span className="text-slate-500">Name</span><span className="font-semibold text-slate-800">{selectedOrder.customerName || selectedOrder.user?.name || "Guest Customer"}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Phone</span><span className="font-semibold text-slate-800 tabular-nums">{selectedOrder.phone || "—"}</span></div>
                    <div className="flex flex-col gap-1 pt-1 border-t border-slate-200/60"><span className="text-slate-500">Shipping Address</span><span className="font-medium text-slate-700">{selectedOrder.address || "—"}</span></div>
                  </div>
                </div>

                {/* Section 2: Product Details */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                    Product Details
                  </h3>
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 space-y-2.5">
                    <div className="flex justify-between"><span className="text-slate-500">Product Line</span><span className="font-semibold text-slate-800">{selectedOrder.product?.productName || "Product Deleted"}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Material Type</span><span className="font-medium text-slate-700">{selectedOrder.product?.materialType || "—"}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Thickness Specs</span><span className="font-medium text-slate-700">{selectedOrder.product?.thickness || "—"}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Dimensions</span><span className="font-medium text-slate-700 tabular-nums">{selectedOrder.product?.dimensions?.length || 0} × {selectedOrder.product?.dimensions?.width || 0} {selectedOrder.product?.dimensions?.unit || "ft"}</span></div>
                  </div>
                </div>

                {/* Section 3: Order Configuration */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                    Order Configuration
                  </h3>
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 space-y-2.5">
                    <div className="flex justify-between"><span className="text-slate-500">Quantity</span><span className="font-semibold text-slate-800 tabular-nums">× {selectedOrder.quantity || 1}</span></div>
                    <div className="flex justify-between items-center"><span className="text-slate-500">Processing Status</span><span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusClasses(selectedOrder.orderStatus)}`}>{selectedOrder.orderStatus || "Pending"}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Ordered On</span><span className="font-medium text-slate-700 tabular-nums">{selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString() : "N/A"}</span></div>
                    <div className="flex justify-between items-center pt-2.5 border-t border-slate-200/60"><span className="text-base font-bold text-slate-900">Total Charged</span><span className="text-lg font-black text-indigo-600 tabular-nums">₹{(selectedOrder.totalPrice || 0).toLocaleString("en-IN")}</span></div>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white transition font-semibold text-xs shadow-sm"
                >
                  Close Receipt
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default ManageOrders;