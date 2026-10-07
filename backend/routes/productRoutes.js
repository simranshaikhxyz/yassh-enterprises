import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// =======================
// Public Routes
// =======================

router.get("/", getProducts);
router.get("/:id", getProductById);

// =======================
// Admin Routes
// =======================

// Add Product with Multiple Image Upload (allows up to 5 images)
router.post(
  "/",
  protect,
  admin,
  upload.array("images", 5),
  createProduct
);

// Update Product (also supporting multiple images if updated here)
router.put(
  "/:id",
  protect,
  admin,
  upload.array("images", 5),
  updateProduct
);

// Delete Product
router.delete("/:id", protect, admin, deleteProduct);

export default router;