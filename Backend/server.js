import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./utils/connectDB.js";
import AuthRouter from "./Routes/auth.routes.js";
import TaskRouter from "./Routes/task.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",")
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// ✅ Connect to DB BEFORE registering routes
// Uses a singleton so we don't reconnect on every serverless invocation
let isConnected = false;
const ensureDBConnected = async (req, res, next) => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  next();
};

app.use(ensureDBConnected);

app.use("/api/auth", AuthRouter);
app.use("/api/task", TaskRouter);

const port = process.env.PORT || 3000;

// Only start listening when run directly (local dev), not on Vercel
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
  });
}

export default app;
