import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    dimensions: {
      length: {
        type: Number,
        required: true,
      },

      width: {
        type: Number,
        required: true,
      },

      height: {
        type: Number,
        required: true,
      },

      unit: {
        type: String,
        default: "ft",
      },
    },

    materialType: {
      type: String,
      required: true,
      trim: true,
    },

    thickness: {
      type: String,
      required: true,
      trim: true,
    },

    color: {
      type: String,
      default: "",
      trim: true,
    },

    customizable: {
      type: Boolean,
      default: false,
    },

    images: {
      type: [String],
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;