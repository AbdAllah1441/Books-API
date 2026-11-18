import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import { connectDB, disconnectDB } from "./config/db.js";

config();
await connectDB();

const app = express();
const port = process.env.PORT || 5001;

// import routes
import bookRoutes from "./routes/bookRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// enable CORS for all routes
app.use(cors());

// main route
app.get("/", (req, res) => {
  res.json({ message: "Hello, World!" });
});

// use book routes
app.use("/books", bookRoutes);
// use auth routes
app.use("/auth", authRoutes);

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Handle unhandled promise rejections and disconnect from the database
process.on("unhandledRejection", async (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

//handle uncaught exceptions and disconnect from the database
process.on("uncaughtException", async (error) => {
  console.error("Uncaught Exception:", error);
  await disconnectDB();
  process.exit(1);
});

// gracefull shutdown on SIGINT and SIGTERM
process.on("SIGTERM", async () => {
  console.log("Received SIGTERM. Shutting down gracefully...");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});
