import { Request, Response } from "express";
import Borrow from "../models/borrow.model";
import Book from "../models/book.model";

// POST /api/borrow - borrow a book
export const borrowBook = async (req: Request, res: Response) => {
  try {
    const { bookId, quantity, dueDate } = req.body;

    if (!bookId || !quantity || !dueDate) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than 0." });
    }

    // Find book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    // Check available copies
    if (book.copies < quantity) {
      return res.status(400).json({ message: "Not enough copies available." });
    }

    // Create borrow record
    const borrow = new Borrow({
      book: bookId,
      quantity,
      dueDate,
    });

    await borrow.save();

    // Update book copies and availability
    book.copies -= quantity;
    if (book.copies === 0) {
      book.available = false;
    }
    await book.save();

    res.status(201).json({ message: "Book borrowed successfully.", borrow });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to borrow book." });
  }
};

// GET /api/borrow/summary - get borrow aggregation summary
export const getBorrowSummary = async (req: Request, res: Response) => {
  try {
    const summary = await Borrow.aggregate([
      {
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      { $unwind: "$bookDetails" },
      {
        $project: {
          _id: 0,
          title: "$bookDetails.title",
          isbn: "$bookDetails.isbn",
          totalQuantity: 1,
        },
      },
    ]);

    res.json(summary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get borrow summary." });
  }
};
