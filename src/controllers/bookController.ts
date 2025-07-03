import { Request, Response } from "express";
import Book from "../models/book.model";

// GET /api/books - list all books
export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Failed to get books." });
  }
};

// GET /api/books/:id - get single book
export const getBookById = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book)
      return res.status(404).json({ message: "Book not found." });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Failed to get book." });
  }
};

// POST /api/books - create new book
export const createBook = async (req: Request, res: Response) => {
  try {
    const { title, author, genre, isbn, description, copies, available } = req.body;

    if (!title || !author || !genre || !isbn || copies === undefined) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const book = new Book({
      title,
      author,
      genre,
      isbn,
      description,
      copies,
      available: available !== undefined ? available : true,
    });

    // If copies === 0, mark as unavailable
    if (copies === 0) book.available = false;

    await book.save();

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: "Failed to create book." });
  }
};

// PATCH /api/books/:id - update book
export const updateBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book)
      return res.status(404).json({ message: "Book not found." });

    const { title, author, genre, isbn, description, copies, available } = req.body;

    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (genre !== undefined) book.genre = genre;
    if (isbn !== undefined) book.isbn = isbn;
    if (description !== undefined) book.description = description;
    if (copies !== undefined) {
      book.copies = copies;
      // If copies === 0, mark unavailable
      book.available = copies > 0 ? (available ?? book.available) : false;
    }
    if (available !== undefined) book.available = available;

    await book.save();

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Failed to update book." });
  }
};

// DELETE /api/books/:id - delete book
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book)
      return res.status(404).json({ message: "Book not found." });
    res.json({ message: "Book deleted." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete book." });
  }
};
