import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin:"http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js";
import bookingsRouter from "./routes/bookings.routes.js";
import cabinsRouter from "./routes/cabins.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/bookings", bookingsRouter);
app.use("/api/v1/cabins", cabinsRouter);

export { app };
