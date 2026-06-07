// backend/src/routes/familyMember.routes.js
import express from "express";
import {
  getMembersByFamily,
  createMember,
  updateMember,
  deleteMember,
} from "../controllers/familyMember.controller.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Semua route anggota keluarga hanya bisa diakses oleh Ketua RT (terproteksi)
router.get("/:familyId", requireAuth, getMembersByFamily);
router.post("/:familyId", requireAuth, createMember);
router.put("/:memberId", requireAuth, updateMember);
router.delete("/:memberId", requireAuth, deleteMember);

export default router;
