// backend/src/routes/inventory.routes.js
import express from "express";
import {
  getInventories,
  createInventory,
  deleteInventory,
  updateInventory,
  getInventoryForCitizens,
  getInventoryById,
} from "../controllers/inventory.controller.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route Publik (Warga)
router.get("/", getInventoryForCitizens);
router.get("/:id", getInventoryById);

// Route Terproteksi (Hanya Ketua RT dengan JWT)
router.post("/", requireAuth, createInventory);
router.delete("/:id", requireAuth, deleteInventory); // Jalur DELETE baru
router.put("/:id", requireAuth, updateInventory);

export default router;
