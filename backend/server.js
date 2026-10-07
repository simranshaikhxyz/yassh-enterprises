import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import fileUpload from "express-fileupload";
import mongoSanitize from "express-mongo-sanitize";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

import { protect } from "./middleware/authMiddleware.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.set("trust proxy", 1);

/* ----------------------- Security & Core Middleware ----------------------- */

// Guard 1: Set secure HTTP headers
app.use(helmet());

//  Guard 2: Disable Express server identity headers
app.disable("x-powered-by");

// Guard 3: Restrict CORS origins safely
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173", // Dev server fallback
].filter(Boolean); // Removes undefined values if env variable is missing

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy violation: Access denied."));
      }
    },
    credentials: true,
  })
);

//  Guard 4: Payload size limiting
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

//  Guard 5: Safe NoSQL Injection Defense (Avoids getter-only req.query crash)
app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  next();
});

//  Guard 6: Secure File Upload limits
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 5 * 1024 * 1024 }, // Max file size limit: 5MB
    abortOnLimit: true,
  })
);

/* ------------------------ Routes -------------------------- */

app.get("/", (req, res) => {
  res.send("MetalPro Backend Running ");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);

/* -------------------- Protected Route --------------------- */

app.get("/api/profile", protect, (req, res) => {
  res.json(req.user);
});

/* ------------------------ Global Error Handler -------------------------- */

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Route not found - ${req.originalUrl}` });
});

// Production-Safe Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  const statusCode = err.status || (res.statusCode === 200 ? 500 : res.statusCode);
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : err.message || "Something went wrong";

  res.status(statusCode).json({ message });
});

/* ------------------------ Server Listener & Crash Guards -------------------------- */

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(` Server running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
});

// Handle unhandled promise rejections gracefully
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection Failure:", err.message);
  server.close(() => process.exit(1));
});