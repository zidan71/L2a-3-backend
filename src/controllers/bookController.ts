import { Request, Response } from "express";
import Book from "../models/book.model";

export const getBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch {
    res.status(500).json({ message: "Failed to get books." });
  }
};

export const getBookById = async (req: Request, res: Response): Promise<void> => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book){
          res.status(404).json({ message: "Book not found." });
          return
    }
    
    res.json(book);
  } catch {
    res.status(500).json({ message: "Failed to get book." });
  }
};

export const createBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, author, genre, isbn, description, copies, available } = req.body;

    if (!title || !author || !genre || !isbn || copies === undefined) {
       res.status(400).json({ message: "Missing required fields." });
       return
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

    if (copies === 0) book.available = false;

    await book.save();
    res.status(201).json(book);
  } catch {
    res.status(500).json({ message: "Failed to create book." });
  }
};

export const updateBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book){
         res.status(404).json({ message: "Book not found." })
         return
    } 

    const { title, author, genre, isbn, description, copies, available } = req.body;

    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (genre !== undefined) book.genre = genre;
    if (isbn !== undefined) book.isbn = isbn;
    if (description !== undefined) book.description = description;
    if (copies !== undefined) {
      book.copies = copies;
      book.available = copies > 0 ? (available ?? book.available) : false;
    }
    if (available !== undefined) book.available = available;

    await book.save();
    res.json(book);
  } catch {
    res.status(500).json({ message: "Failed to update book." });
  }
};

export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book){
         res.status(404).json({ message: "Book not found." });
         return
    }
    
    res.json({ message: "Book deleted." });
  } catch {
    res.status(500).json({ message: "Failed to delete book." });
  }
};
