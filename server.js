const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Import routes
const greenVegRoutes = require("./Routes/greenVegRoutes");
const freshTeaRoutes = require("./Routes/freashtearoutes.js");
const freshFruitRoutes = require("./Routes/freshFruitRoutes");
const freshJuiceRoutes = require("./Routes/freshJuiceRoutes");
const freshBreadRoutes = require("./Routes/freshBreadRoutes");
const freshDreadJuiceRoutes = require("./Routes/freshDreadRoutes.js");
const customerRoutes = require("./Routes/customer.routes.js");
const adminRoutes = require("./Routes/adminRoutes.js");

const useRoutes = require("./Routes/user.routes.js");
const orderRoutes = require("./Routes/order.Routes.js");
dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "https://difacash-frontend7.vercel.app"], 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/freshfruits", freshFruitRoutes);
app.use("/api/greenvegs", greenVegRoutes);
app.use("/api/freshteas", freshTeaRoutes);
app.use("/api/freshjuices", freshJuiceRoutes);
app.use("/api/freshdreadjuices", freshDreadJuiceRoutes);
app.use("/api/freshbreads", freshBreadRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/user", useRoutes);

app.use("/api/orders", orderRoutes);
const dashboardRoutes = require("./Routes/dashboar.routes.js");
app.use("/api/dashboard", dashboardRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// DB connection
mongoose
  .connect(process.env.MONGODB_URI || process.env.url)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
