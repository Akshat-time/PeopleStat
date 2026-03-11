import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// Load environment variables
dotenv.config();

// Create express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Basic Route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Add your routes
import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import optimizationRoutes from "./routes/optimizationRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/optimization", optimizationRoutes);

// Server Running
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
