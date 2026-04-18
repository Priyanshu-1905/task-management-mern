const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// ✅ Middleware (VERY IMPORTANT)
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running...");
});
const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", taskRoutes);

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});