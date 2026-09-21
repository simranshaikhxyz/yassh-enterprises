import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";

function AddProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [product, setProduct] = useState({
    productName: "",
    description: "",
    price: "",
    materialType: "",
    thickness: "",
    color: "",
    images: [],
    customizable: false,
    dimensions: {
      length: "",
      width: "",
      height: "",
      unit: "ft",
    },
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEditMode) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/products/${id}`);

        setProduct({
          productName: data.productName || "",
          description: data.description || "",
          price: data.price || "",
          materialType: data.materialType || "",
          thickness: data.thickness || "",
          color: data.color || "",
          images:
            data.images && data.images.length > 0
              ? data.images
              : data.image
              ? [data.image]
              : [],
          customizable: data.customizable || false,
          dimensions: {
            length: data.dimensions?.length || "",
            width: data.dimensions?.width || "",
            height: data.dimensions?.height || "",
            unit: data.dimensions?.unit || "ft",
          },
        });
      } catch (error) {
        console.error("Fetch product error:", error);
        alert(
          error.response?.data?.message ||
            "Failed to load product details."
        );
        navigate("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (["length", "width", "height", "unit"].includes(name)) {
      setProduct((prev) => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          [name]: value,
        },
      }));
    } else {
      setProduct((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        alert("Only JPG, PNG and WEBP images are allowed.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(`Image "${file.name}" exceeds the 5 MB limit.`);
        return;
      }
    }

    try {
      setUploading(true);

      const uploadedImageUrls = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append("image", file);

        const { data } = await API.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (data.image) {
          uploadedImageUrls.push(data.image);
        }
      }

      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImageUrls],
      }));

      alert("Images uploaded successfully.");
    } catch (error) {
      console.error("Upload image error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to upload images."
      );
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (product.productName.trim().length < 3) {
      return alert(
        "Product name must contain at least 3 characters."
      );
    }

    if (product.description.trim().length < 20) {
      return alert(
        "Description must contain at least 20 characters."
      );
    }

    if (Number(product.price) <= 0) {
      return alert("Enter a valid product price.");
    }

    if (Number(product.dimensions.length) <= 0) {
      return alert("Enter a valid length.");
    }

    if (Number(product.dimensions.width) <= 0) {
      return alert("Enter a valid width.");
    }

    if (Number(product.dimensions.height) <= 0) {
      return alert("Enter a valid height.");
    }

    if (!product.images || product.images.length === 0) {
      return alert(
        "Please upload at least one product image."
      );
    }

    try {
      setSaving(true);

      const payload = {
        ...product,
        image: product.images[0],
      };

      if (isEditMode) {
        await API.put(`/products/${id}`, payload);
        alert("Product updated successfully.");
      } else {
        await API.post("/products", payload);
        alert("Product added successfully.");
      }

      navigate("/admin/products");
    } catch (error) {
      console.error("Save product error:", error);

      alert(
        error.response?.data?.message ||
          `Failed to ${
            isEditMode ? "update" : "add"
          } product.`
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 antialiased font-sans">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            {isEditMode ? "Edit Product" : "Add New Product"}
          </h1>

          <p className="text-slate-500 mt-2">
            {isEditMode
              ? "Update existing product details and save changes."
              : "Fill in the product information to add it to your catalog."}
          </p>
        </div>

        <form
          onSubmit={submitHandler}
          className="bg-white rounded-2xl shadow-lg p-8 space-y-10 border border-slate-100"
        >

          {/* General Information */}
          <section>
            <h2 className="text-xl font-semibold mb-6 border-b pb-2 text-slate-800">
              General Information
            </h2>

            <div className="space-y-5">

              <div>
                <label className="block mb-2 font-medium text-slate-700">
                  Product Name
                </label>

                <input
                  type="text"
                  name="productName"
                  value={product.productName}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-slate-700">
                  Description
                </label>

                <textarea
                  rows="5"
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  placeholder="Enter detailed product description..."
                  className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition"
                  required
                />
              </div>

            </div>
          </section>

          {/* Product Details */}
          <section>
            <h2 className="text-xl font-semibold mb-6 border-b pb-2 text-slate-800">
              Product Details
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              <div>
                <label className="block mb-2 font-medium text-slate-700">
                  Price (₹)
                </label>

                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-slate-700">
                  Material Type
                </label>

                <input
                  type="text"
                  name="materialType"
                  value={product.materialType}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-slate-700">
                  Thickness
                </label>

                <input
                  type="text"
                  name="thickness"
                  value={product.thickness}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-slate-700">
                  Color
                </label>

                <input
                  type="text"
                  name="color"
                  value={product.color}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />
              </div>

            </div>
          </section>

          {/* Dimensions */}
          <section>
            <h2 className="text-xl font-semibold mb-6 border-b pb-2 text-slate-800">
              Dimensions
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

              {/* Length */}
              <div>
                <label className="block mb-2 font-medium text-slate-700">
                  Length
                </label>

                <input
                  type="number"
                  name="length"
                  value={product.dimensions.length}
                  onChange={handleChange}
                  placeholder="Length"
                  min="0"
                  step="any"
                  className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  required
                />
              </div>

              {/* Width */}
              <div>
                <label className="block mb-2 font-medium text-slate-700">
                  Width
                </label>

                <input
                  type="number"
                  name="width"
                  value={product.dimensions.width}
                  onChange={handleChange}
                  placeholder="Width"
                  min="0"
                  step="any"
                  className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  required
                />
              </div>

              {/* Height */}
              <div>
                <label className="block mb-2 font-medium text-slate-700">
                  Height
                </label>

                <input
                  type="number"
                  name="height"
                  value={product.dimensions.height}
                  onChange={handleChange}
                  placeholder="Height"
                  min="0"
                  step="any"
                  className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  required
                />
              </div>

              {/* Unit */}
              <div>
                <label className="block mb-2 font-medium text-slate-700">
                  Unit
                </label>

                <select
                  name="unit"
                  value={product.dimensions.unit}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white"
                >
                  <option value="ft">ft</option>
                  <option value="inch">inch</option>
                  <option value="cm">cm</option>
                  <option value="mm">mm</option>
                </select>
              </div>

            </div>
          </section>

          {/* Multiple Image Upload */}
          <section>
            <h2 className="text-xl font-semibold mb-6 border-b pb-2 text-slate-800">
              Product Images (Multiple allowed)
            </h2>

            <label className="block border-2 border-dashed border-slate-300 rounded-2xl p-10 cursor-pointer hover:border-indigo-500 transition text-center bg-slate-50/50">

              <input
                type="file"
                multiple
                accept="image/*"
                disabled={uploading}
                onChange={handleImageUpload}
                className="hidden"
              />

              {uploading ? (
                <div>
                  <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

                  <p className="mt-4 text-indigo-600 font-semibold">
                    Uploading images...
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-5xl mb-3">📷</div>

                  <p className="text-lg font-semibold text-slate-700">
                    Click or Drag & Drop to Add More Product Images
                  </p>

                  <p className="text-sm text-slate-500 mt-2">
                    PNG, JPG or WEBP (Maximum 5 MB each)
                  </p>
                </>
              )}

            </label>

            {/* Preview Grid */}
            {product.images && product.images.length > 0 && (
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">

                {product.images.map((imgUrl, index) => (
                  <div
                    key={index}
                    className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100"
                  >
                    <img
                      src={imgUrl}
                      alt={`Product preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition shadow-md"
                      title="Remove image"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>

                    <span className="absolute bottom-2 left-2 bg-slate-900/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      #{index + 1}
                    </span>
                  </div>
                ))}

              </div>
            )}
          </section>

          {/* Customizable */}
          <section>
            <h2 className="text-xl font-semibold mb-6 border-b pb-2 text-slate-800">
              Additional Options
            </h2>

            <label className="flex items-center gap-3 cursor-pointer">

              <input
                type="checkbox"
                id="customizable"
                name="customizable"
                checked={product.customizable}
                onChange={handleChange}
                className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
              />

              <span className="font-medium text-slate-700">
                This product can be customized.
              </span>

            </label>
          </section>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 border-t pt-8">

            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="px-7 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition font-medium text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || uploading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-8 py-3 rounded-xl font-semibold transition text-sm shadow-sm"
            >
              {saving
                ? isEditMode
                  ? "Updating Product..."
                  : "Adding Product..."
                : isEditMode
                ? "Update Product"
                : "Add Product"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;