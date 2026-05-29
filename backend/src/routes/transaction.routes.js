// backend/src/routes/transaction.routes.js
import express from "express";
import {
  getTransactions,
  getTransactionSummary,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transaction.controller.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route Publik (Akses Landing Page Warga)
router.get("/summary", getTransactionSummary);
router.get("/", getTransactions);

// Route Terproteksi (Akses Dashboard Ketua RT)
router.post("/", requireAuth, createTransaction);
router.put("/:id", requireAuth, updateTransaction);
router.delete("/:id", requireAuth, deleteTransaction);

export default router;
