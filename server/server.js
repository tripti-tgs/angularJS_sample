const express = require("express");
const db = require("./config/db");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

const app = express();
app.use(express.json());

// Test DB connection
db.authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.error("DB connection failed:", err));

// Middleware
app.use(cors());
// app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/users", userRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
