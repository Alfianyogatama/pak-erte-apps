// backend/src/routes/info.routes.js
import express from "express";
import multer from "multer";
import {
  getInformations,
  createInformation,
  deleteInformation,
  updateInformation,
} from "../controllers/info.controller.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  // Kita besarkan limitnya karena nanti dikompresi di frontend, tapi sedia payung sebelum hujan
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.get("/", getInformations);
// Mengizinkan multiple file dengan nama field "images", maksimal 5 file
router.post("/", requireAuth, upload.array("images", 5), createInformation);
router.delete("/:id", requireAuth, deleteInformation);
router.put("/:id", requireAuth, upload.array("images", 5), updateInformation);
export default router;
