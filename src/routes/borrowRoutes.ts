import { Router } from "express";
import { borrowBook, getBorrowSummary } from "../controllers/borrowController";

const router = Router();

router.post("/", borrowBook);
router.get("/summary", getBorrowSummary);

export default router;
