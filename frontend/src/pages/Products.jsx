import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await API.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to load products catalog:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 sm:py-14 px-4 sm:px-6 animate-pulse">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="h-3 w-24 bg-slate-200 rounded mx-auto mb-4" />
            <div className="h-10 w-64 bg-slate-200 rounded-lg mx-auto mb-3" />
            <div className="h-4 w-80 max-w-full bg-slate-200 rounded mx-auto" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
              >
                <div className="h-52 bg-slate-200" />

                <div className="p-5">
                  <div className="h-6 w-3/4 bg-slate-200 rounded mb-3" />
                  <div className="h-4 w-full bg-slate-100 rounded mb-2" />
                  <div className="h-4 w-5/6 bg-slate-100 rounded mb-5" />

                  <div className="flex gap-2 mb-6">
                    <div className="h-6 w-20 bg-slate-100 rounded-md" />
                    <div className="h-6 w-16 bg-slate-100 rounded-md" />
                  </div>

                  <div className="border-t border-slate-100 pt-4 flex justify-between">
                    <div>
                      <div className="h-3 w-20 bg-slate-100 rounded mb-2" />
                      <div className="h-7 w-20 bg-slate-200 rounded" />
                    </div>
                    <div className="h-10 w-28 bg-slate-200 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Heading */}
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-lg font-bold uppercase tracking-[0.25em] text-indigo-600 mb-3">
            Yassh Enterprises
          </p>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-970">
            Products Made for Real Work
          </h1>

          <p className="max-w-2xl mx-auto mt-4 text-sm sm:text-base text-slate-500 leading-7">
            Explore our range of practical metal products built for
            storage, utility and industrial applications.
          </p>

          <div className="inline-flex items-center gap-2 mt-5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-500 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            {products.length} Products Available
          </div>
        </div>

        {/* Products */}
        {products.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 sm:p-14 text-center max-w-md mx-auto shadow-sm">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>

            <h2 className="text-lg font-bold text-slate-900">
              No Products Available
            </h2>

            <p className="text-slate-500 text-sm mt-2 leading-6">
              Please check back later or contact us for product
              availability.
            </p>

            <Link
              to="/contact"
              className="inline-flex mt-6 px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-all duration-200"
            >
              Contact Us
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {products.map((product) => (
              <div
                key={product._id}
                className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* Product Image */}
                <Link
                  to={`/products/${product._id}`}
                  className="block relative overflow-hidden bg-slate-100"
                >
                  <div className="aspect-[4/3]">
                    <img
                      src={
                        product.image && product.image !== ""
                          ? product.image
                          : "https://via.placeholder.com/600x450?text=Metal+Product"
                      }
                      alt={product.productName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>

                  {/* Small image overlay */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-white/95 backdrop-blur-sm text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                      View Product →
                    </span>
                  </div>
                </Link>

                {/* Product Details */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col">

                  {/* Title */}
                  <div className="flex-1">
                    <Link to={`/products/${product._id}`}>
                      <h2 className="text-lg sm:text-xl font-bold text-slate-950 leading-snug hover:text-indigo-700 transition-colors duration-200">
                        {product.productName}
                      </h2>
                    </Link>

                    {/* Description */}
                    <p className="text-sm text-slate-500 line-clamp-2 mt-2.5 leading-6">
                      {product.description}
                    </p>

                    {/* Specifications */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {product.materialType && (
                        <span className="text-[11px] font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">
                          {product.materialType}
                        </span>
                      )}

                      {product.thickness && (
                        <span className="text-[11px] font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">
                          {product.thickness}
                        </span>
                      )}

                      {product.color && (
                        <span className="text-[11px] font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">
                          {product.color}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Section */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-end justify-between gap-4">

                    <div>
                      <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-slate-400">
                        Price / Unit
                      </p>

                      <p className="text-2xl font-black text-slate-950 tracking-tight mt-0.5">
                        ₹{product.price?.toLocaleString("en-IN") || "0"}
                      </p>
                    </div>

                    <Link
                      to={`/products/${product._id}`}
                      className="shrink-0 inline-flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 hover:shadow-md"
                    >
                      View Details
                      <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Custom Requirement CTA */}
        {products.length > 0 && (
          <section className="mt-14 sm:mt-16">
            <div className="relative overflow-hidden bg-slate-950 rounded-2xl px-6 py-9 sm:px-10 sm:py-10">

              <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-300">
                    Need Something Custom?
                  </p>

                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
                    Have a specific size or requirement?
                  </h2>

                  <p className="text-sm text-slate-400 mt-2 max-w-xl leading-6">
                    Tell us what you need and we can discuss the material,
                    dimensions and quantity for your requirement.
                  </p>
                </div>

                <Link
                  to="/contact"
                  className="shrink-0 bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm px-5 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                >
                  Discuss Your Requirement →
                </Link>
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

export default Products;