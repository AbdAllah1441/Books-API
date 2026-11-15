const express = require("express");
const app = express();
const port = process.env.PORT || 5001;

// parse JSON requests
app.use(express.json());

// main route
app.get("/", (req, res) => {
  res.json({ message: "Hello, World!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
