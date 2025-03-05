require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
require("./config/googleAuth");


const authRoutes = require("./routes/authRoutes");
const letterRoutes = require("./routes/letterRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));
app.use(cookieParser());
// app.use(passport.initialize());
// app.use(passport.session());

// Routes
app.get("/", (req, res) => {
  res.send("Backend Server is running");
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/letters", letterRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
