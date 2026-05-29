import express from "express";
import {
  getFamilies,
  getFamilySummary,
  createFamily,
  updateFamily,
  deleteFamily,
  getPublicFamilies, // 1. Impor fungsi baru
} from "../controllers/family.controller.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route Publik (Bisa diakses tanpa login)
router.get("/summary", getFamilySummary);
router.get("/public", getPublicFamilies); // 2. Jalur akses publik baru

// Route Terproteksi (Hanya Ketua RT)
router.get("/", requireAuth, getFamilies);
router.post("/", requireAuth, createFamily);
router.put("/:id", requireAuth, updateFamily);
router.delete("/:id", requireAuth, deleteFamily);

export default router;
