import Review from "../models/Review.js";

// Add Review
export const addReview = async (req, res) => {
  try {
    const { product, rating, comment } = req.body;

    const review = await Review.create({
      user: req.user._id,
      product,
      rating,
      comment,
    });

    res.status(201).json({
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Reviews For Product
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
    }).populate("user", "name");

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};