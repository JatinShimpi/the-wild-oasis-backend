import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";

const app = express();

// 1) Global Middlewares

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!"
});
app.use("/api", limiter);

// CORS configuration for both frontends
app.use(
  cors({
    origin: [
      "http://localhost:3000", // Next.js website
      "http://localhost:5173", // Vite admin dashboard
      process.env.FRONTEND_URL,
      process.env.ADMIN_URL,
    ].filter(Boolean),
    credentials: true,
  })
);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Import routes
import userRouter from "./routes/user.routes.js";
import bookingsRouter from "./routes/bookings.routes.js";
import cabinsRouter from "./routes/cabins.routes.js";
import settingsRouter from "./routes/settings.routes.js";
import guestsRouter from "./routes/guests.routes.js";

// API routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/bookings", bookingsRouter);
app.use("/api/v1/cabins", cabinsRouter);
app.use("/api/v1/settings", settingsRouter);
app.use("/api/v1/guests", guestsRouter);

// Health check endpoint
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export { app };
