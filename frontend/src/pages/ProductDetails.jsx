import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const fetchProduct = useCallback(async () => {
    try {
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
    } catch (error) {
      console.error("Failed to load product details:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleOrder = () => {
    const userInfo = JSON.parse(
      localStorage.getItem("userInfo")
    );

    if (!userInfo) {
      alert("Please login to place an order.");
      navigate("/login");
      return;
    }

    navigate(`/products/${product._id}/order`);
  };

  // Modern Shimmer Skeleton Loading State
  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-12 px-6 animate-pulse">
        <div className="max-w-6xl mx-auto">
          <div className="h-6 w-32 bg-slate-200 rounded mb-8" />
          <div className="grid md:grid-cols-2 gap-10 bg-white border border-slate-100 rounded-2xl p-8">
            <div className="w-full h-[450px] bg-slate-100 rounded-xl" />
            <div className="space-y-6">
              <div className="h-10 w-3/4 bg-slate-200 rounded" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-slate-100 rounded" />
                <div className="h-4 w-5/6 bg-slate-100 rounded" />
              </div>
              <div className="space-y-4 pt-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-6 w-1/2 bg-slate-100 rounded" />
                ))}
              </div>
              <div className="h-12 w-full bg-slate-100 rounded-xl mt-8" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Extract images array, fallback to single image, or placeholder if none exist
  const images =
    product.images && product.images.length > 0
      ? product.images
      : product.image && product.image !== ""
      ? [product.image]
      : ["https://via.placeholder.com/600x400?text=Metal+Product"];

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 antialiased font-sans py-12">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Products
          </Link>
        </div>

        {/* Product Details Wrapper */}
        <div className="grid md:grid-cols-2 gap-10 bg-white border border-slate-150 rounded-2xl p-8 shadow-sm">
          
          {/* Left Column: Image Slider & Thumbnails */}
          <div className="space-y-4">
            <div className="relative group overflow-hidden bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center p-4">
              <img
                src={images[activeImageIndex]}
                alt={product.productName}
                className="max-h-[350px] w-auto object-contain rounded-lg transition-all duration-300"
              />

              {/* Slider Arrows (Only show if there is more than one image) */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-900/60 hover:bg-slate-900 text-white p-2.5 rounded-full backdrop-blur-sm transition opacity-0 group-hover:opacity-100 shadow-lg"
                    aria-label="Previous image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900/60 hover:bg-slate-900 text-white p-2.5 rounded-full backdrop-blur-sm transition opacity-0 group-hover:opacity-100 shadow-lg"
                    aria-label="Next image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <div className="absolute bottom-3 right-3 bg-slate-900/75 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                    {activeImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Selection Row */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((imgUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all bg-slate-50 ${
                      activeImageIndex === index
                        ? "border-indigo-600 shadow-md ring-2 ring-indigo-600/20 scale-[1.02]"
                        : "border-slate-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information */}
          <div className="flex flex-col justify-between py-2">
            <div>
              {/* Product Title */}
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {product.productName}
              </h1>

              {/* Description */}
              <p className="mt-4 text-slate-500 text-sm leading-relaxed">
                {product.description}
              </p>

              {/* Specification Table */}
              <div className="mt-8">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Technical Specifications
                </h3>
                
                <div className="divide-y divide-slate-100 border-t border-b border-slate-100 text-sm">
                  <div className="py-3 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Material / Grade</span>
                    <span className="font-semibold text-slate-900">{product.materialType || "N/A"}</span>
                  </div>

                  <div className="py-3 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Thickness Gauge</span>
                    <span className="font-semibold text-slate-900">{product.thickness || "N/A"}</span>
                  </div>

                  <div className="py-3 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Standard Dimensions</span>
                    <span className="font-semibold text-slate-900">
                      {product.dimensions?.length && product.dimensions?.width ? (
                        `${product.dimensions.length} × ${product.dimensions.width} ${product.dimensions.unit || "mm"}`
                      ) : (
                        "Custom Sizes Available"
                      )}
                    </span>
                  </div>

                  <div className="py-3 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Finish / Color</span>
                    <span className="font-semibold text-slate-900">{product.color || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions Block */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Unit Price</span>
                <p className="text-3xl font-black text-slate-900 tracking-tight mt-0.5">
                  ₹{product.price?.toLocaleString("en-IN") || "0"}
                </p>
              </div>

              <button
                onClick={handleOrder}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-xl shadow-md hover:shadow-lg transition duration-150"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Place Custom Order
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default ProductDetails;