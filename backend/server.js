require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/project", require("./routes/projectRoutes"));
app.use("/api/task", require("./routes/taskRoutes"));
app.use("/api/user", require("./routes/userRoutes"));

// Root route (important for Railway test)
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Port
const PORT = process.env.PORT || 5000;

// DB + Server Start
mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Error:", err);
    process.exit(1); // force crash so you see error in Railway logs
  });