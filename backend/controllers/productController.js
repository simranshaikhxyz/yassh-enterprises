import Product from "../models/Product.js";

// ======================
// Create Product
// ======================

export const createProduct = async (req, res) => {
  try {
    const {
      productName,
      description,
      price,
      materialType,
      thickness,
      dimensions,
      color,
      customizable,
      images,
      image,
    } = req.body;

    // Handle both multi-image array and single-image fallback safely
    const productImages =
      images && Array.isArray(images) && images.length > 0
        ? images
        : image
        ? [image]
        : [];

    const product = await Product.create({
      productName,
      description,
      price,
      materialType,
      thickness,
      dimensions,
      color,
      customizable,
      images: productImages,
      image: image || productImages[0] || "",
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================
// Get All Products
// ======================

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    console.error("Get Products Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================
// Get Single Product
// ======================

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Get Product Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================
// Update Product
// ======================

export const updateProduct = async (req, res) => {
  try {
    const {
      productName,
      description,
      price,
      materialType,
      thickness,
      dimensions,
      color,
      customizable,
      images,
      image,
    } = req.body;

    const updateData = {
      productName,
      description,
      price,
      materialType,
      thickness,
      dimensions,
      color,
      customizable,
    };

    // Update images array if sent from frontend
    if (images && Array.isArray(images)) {
      updateData.images = images;
      if (images.length > 0) {
        updateData.image = images[0];
      }
    } else if (image) {
      updateData.image = image;
      updateData.images = [image];
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update Product Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================
// Delete Product
// ======================

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};