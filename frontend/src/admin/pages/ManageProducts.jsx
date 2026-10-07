import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/products");
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch products error:", error);
      alert(error.response?.data?.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/products/${id}`);
      
      // Optimistic state update: Immediately remove from local state
      setProducts((prev) => prev.filter((product) => product._id !== id));
      alert("Product deleted successfully.");
    } catch (error) {
      console.error("Delete product error:", error);
      alert(error.response?.data?.message || "Failed to delete product.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600 font-semibold">
            Loading Products...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 antialiased font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Manage Products
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Add, edit, or remove products from your inventory.
            </p>
          </div>

          <Link
            to="/admin/add-product"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-3 rounded-xl shadow-sm transition-all duration-150 text-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Product
          </Link>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold">
                <tr>
                  <th className="p-5">Image</th>
                  <th className="p-5">Product</th>
                  <th className="p-5">Material</th>
                  <th className="p-5">Thickness</th>
                  <th className="p-5">Size</th>
                  <th className="p-5">Price</th>
                  <th className="p-5">Color</th>
                  <th className="p-5 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {products.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-16 text-slate-400 font-medium"
                    >
                      No products found in your inventory.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-slate-50/30 transition-colors"
                    >
                      {/* Image */}
                      <td className="p-5">
                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50 flex-shrink-0">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.productName || "Product"}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/64?text=No+Image";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-xs text-center px-1">
                              No Image
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Product Name */}
                      <td className="p-5 font-semibold text-slate-900">
                        {product.productName || "Unnamed Product"}
                      </td>

                      {/* Material */}
                      <td className="p-5 text-slate-600">
                        {product.materialType || "—"}
                      </td>

                      {/* Thickness */}
                      <td className="p-5 text-slate-500 font-medium">
                        {product.thickness || "—"}
                      </td>

                      {/* Size / Dimensions */}
                      <td className="p-5 text-slate-500 tabular-nums">
                        {product.dimensions?.length || "—"} × {product.dimensions?.width || "—"}
                        <span className="text-xs text-slate-400 font-medium uppercase ml-1">
                          {product.dimensions?.unit || ""}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="p-5 font-bold text-slate-900 tabular-nums">
                        ₹{Number(product.price || 0).toLocaleString("en-IN")}
                      </td>

                      {/* Color */}
                      <td className="p-5 text-slate-500">
                        {product.color || <span className="text-slate-300">—</span>}
                      </td>

                      {/* Actions */}
                      <td className="p-5 text-center">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            to={`/admin/edit-product/${product._id}`}
                            className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition font-medium text-xs"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() => deleteProduct(product._id)}
                            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition font-semibold text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ManageProducts;