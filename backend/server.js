
import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import fileUpload from "express-fileupload";
import mongoSanitize from "express-mongo-sanitize";
import os from "os";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

import { protect } from "./middleware/authMiddleware.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.set("trust proxy", 1);
app.disable("x-powered-by");

// Security headers
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS policy violation: Access denied."));
    },
    credentials: true,
  })
);

// Request parsing
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// NoSQL injection protection
app.use((req, res, next) => {
  try {
    if (req.body && typeof req.body === "object") {
      req.body = mongoSanitize.sanitize(req.body);
    }

    if (req.params && typeof req.params === "object") {
      req.params = mongoSanitize.sanitize(req.params);
    }

    next();
  } catch (error) {
    next(error);
  }
});

// File upload configuration
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: os.tmpdir(),
    limits: { fileSize: 5 * 1024 * 1024 },
    abortOnLimit: true,
  })
);

// Health check
app.get("/", (req, res) => {
  res.status(200).send("MetalPro Backend Running");
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);

// Protected profile route
app.get("/api/profile", protect, (req, res) => {
  res.json(req.user);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: `Route not found - ${req.originalUrl}`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.status || 500;

  res.status(statusCode).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message || "Something went wrong",
  });
});

// Start only after MongoDB connects
const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT} [${
          process.env.NODE_ENV || "development"
        }]`
      );
    });

    server.on("error", (error) => {
      console.error("Server startup error:", error.message);
      process.exit(1);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

