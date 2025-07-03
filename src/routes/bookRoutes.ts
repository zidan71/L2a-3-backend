import { Router } from "express";
import { createBook, deleteBook, getBookById, getBooks, updateBook } from "../controllers/bookController";


const router = Router();

router.get("/", getBooks);
router.get("/:id", getBookById);
router.post("/", createBook);
router.patch("/:id", updateBook);
router.delete("/:id", deleteBook);

export default router;
