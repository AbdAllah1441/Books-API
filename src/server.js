import express from "express";
import cors from "cors";
const app = express();
const port = process.env.PORT || 5001;

// import routes
import bookRoutes from "./routes/bookRoutes.js";

// parse JSON requests
app.use(express.json());
// enable CORS for all routes
app.use(cors());

// main route
app.get("/", (req, res) => {
  res.json({ message: "Hello, World!" });
});

// use book routes
app.use("/books", bookRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
