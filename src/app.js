import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import swaggerUi from "swagger-ui-express";
import { swaggerSpecs } from "./swagger.js";

const app = express();

// Security HTTP Headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate limiting
const limiter = rateLimit({
  max: 100, // Limit each IP to 100 requests per windowMs
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

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

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

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
