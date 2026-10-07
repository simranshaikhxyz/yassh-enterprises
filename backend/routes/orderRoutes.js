import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/orderController.js";

import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  createOrder
);

router.get(
  "/myorders",
  protect,
  getMyOrders
);

router.get(
  "/",
  protect,
  admin,
  getAllOrders
);

router.put(
  "/:id",
  protect,
  admin,
  updateOrderStatus
);

router.put(
  "/:id/cancel",
  protect,
  cancelOrder
);

export default router;