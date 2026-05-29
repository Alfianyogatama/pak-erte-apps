// backend/src/routes/loan.routes.js
import express from "express";
import {
  getLoans,
  createLoan,
  updateLoanStatus,
  returnLoan,
  getLoansByItem,
} from "../controllers/loan.controller.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", requireAuth, getLoans);
router.get("/item/:itemName", requireAuth, getLoansByItem);
router.post("/", requireAuth, createLoan);
router.put("/:id", requireAuth, updateLoanStatus);
router.put("/return/:id", requireAuth, returnLoan);

export default router;
