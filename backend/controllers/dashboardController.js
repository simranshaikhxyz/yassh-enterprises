import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

// @desc    Get dashboard metrics & stats
// @route   GET /api/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    // Execute database queries concurrently for maximum performance
    const [totalProducts, totalOrders, totalCustomers, revenueAggregate] =
      await Promise.all([
        Product.countDocuments(),
        Order.countDocuments(),
        // 🛡️ Filter out unverified temporary accounts
        User.countDocuments({ isAdmin: false, isVerified: true }),
        // 🛡️ Perform revenue summation in MongoDB memory instead of server RAM
        Order.aggregate([
          { $match: { isPaid: true } }, // Adjust filter field based on your Order schema
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$totalPrice" },
            },
          },
        ]),
      ]);

    // Extract revenue result or fallback to 0 if no paid orders exist
    const totalRevenue =
      revenueAggregate.length > 0 ? revenueAggregate[0].totalRevenue : 0;

    res.status(200).json({
      totalProducts,
      totalOrders,
      totalCustomers,
      totalRevenue,
    });
  } catch (error) {
    // 🛡️ Log error internally, suppress stack trace output to client
    console.error("Dashboard Stats Error:", error.message);
    res.status(500).json({
      message: "Failed to fetch dashboard metrics. Please try again.",
    });
  }
};