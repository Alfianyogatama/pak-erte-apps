// backend/src/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import familyRoutes from "./routes/family.routes.js";
import infoRoutes from "./routes/info.routes.js";
import loanRoutes from "./routes/loan.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Terhubung ke database MongoDB"))
  .catch((err) => console.error("❌ Gagal terhubung ke MongoDB:", err.message));

// Route Utama
app.get("/", (req, res) => {
  res.send("API NgN RT 25 Berjalan Normal");
});

// API Routes
app.use("/api/auth", authRoutes); // Jalur akses untuk login
app.use("/api/inventories", inventoryRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/families", familyRoutes);
app.use("/api/informations", infoRoutes);
app.use("/api/loans", loanRoutes);

// Menjalankan Server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
