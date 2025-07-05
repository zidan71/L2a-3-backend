import { Request, Response } from "express";
import Borrow from "../models/borrow.model";
import Book from "../models/book.model";

export const borrowBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookId, quantity, dueDate } = req.body;

    if (!bookId || !quantity || !dueDate) {
      res.status(400).json({ message: "Missing required fields." });
      return;
    }

    if (quantity <= 0) {
      res.status(400).json({ message: "Quantity must be greater than 0." });
      return;
    }

    const book = await Book.findById(bookId);
    if (!book) {
      res.status(404).json({ message: "Book not found." });
      return;
    }

    if (book.copies < quantity) {
      res.status(400).json({ message: "Not enough copies available." });
      return;
    }

    const borrow = new Borrow({
      book: bookId,
      quantity,
      dueDate,
    });

    await borrow.save();

    book.copies -= quantity;
    if (book.copies <= 0) {
      book.available = false;
    }
    await book.save();

    res.status(201).json({ message: "Book borrowed successfully.", borrow });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to borrow book." });
  }
};

export const getBorrowSummary = async (req: Request, res: Response): Promise<void> => {
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
