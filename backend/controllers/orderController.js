import Order from "../models/Order.js";

// Create Order
export const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      phone,
      address,
      product,
      quantity,
      totalPrice,
    } = req.body;

    const order = await Order.create({
      customerName,
      phone,
      address,
      product,
      quantity,
      totalPrice,
      user: req.user._id,
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get My Orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).populate("product");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("product");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Order Status
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.orderStatus =
      req.body.orderStatus ||
      order.orderStatus;

    const updatedOrder =
      await order.save();

    res.status(200).json({
      message:
        "Order status updated successfully",
      updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Cancel Order (Customer)

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Only the owner can cancel
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    // Don't allow cancelling completed/cancelled orders
    if (
      order.orderStatus === "Completed" ||
      order.orderStatus === "Cancelled"
    ) {
      return res.status(400).json({
        message: "This order cannot be cancelled",
      });
    }

    order.orderStatus = "Cancelled";

    await order.save();

    res.json({
      message: "Order cancelled successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};