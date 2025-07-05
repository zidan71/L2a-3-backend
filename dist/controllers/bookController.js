"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.createBook = exports.getBookById = exports.getBooks = void 0;
const book_model_1 = __importDefault(require("../models/book.model"));
const getBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield book_model_1.default.find().sort({ createdAt: -1 });
        res.json(books);
    }
    catch (_a) {
        res.status(500).json({ message: "Failed to get books." });
    }
});
exports.getBooks = getBooks;
const getBookById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield book_model_1.default.findById(req.params.id);
        if (!book) {
            res.status(404).json({ message: "Book not found." });
            return;
        }
        res.json(book);
    }
    catch (_a) {
        res.status(500).json({ message: "Failed to get book." });
    }
});
exports.getBookById = getBookById;
const createBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, author, genre, isbn, description, copies, available } = req.body;
        if (!title || !author || !genre || !isbn || copies === undefined) {
            res.status(400).json({ message: "Missing required fields." });
            return;
        }
        const book = new book_model_1.default({
            title,
            author,
            genre,
            isbn,
            description,
            copies,
            available: available !== undefined ? available : true,
        });
        if (copies === 0)
            book.available = false;
        yield book.save();
        res.status(201).json(book);
    }
    catch (_a) {
        res.status(500).json({ message: "Failed to create book." });
    }
});
exports.createBook = createBook;
const updateBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield book_model_1.default.findById(req.params.id);
        if (!book) {
            res.status(404).json({ message: "Book not found." });
            return;
        }
        const { title, author, genre, isbn, description, copies, available } = req.body;
        if (title !== undefined)
            book.title = title;
        if (author !== undefined)
            book.author = author;
        if (genre !== undefined)
            book.genre = genre;
        if (isbn !== undefined)
            book.isbn = isbn;
        if (description !== undefined)
            book.description = description;
        if (copies !== undefined) {
            book.copies = copies;
            book.available = copies > 0 ? (available !== null && available !== void 0 ? available : book.available) : false;
        }
        if (available !== undefined)
            book.available = available;
        yield book.save();
        res.json(book);
    }
    catch (_a) {
        res.status(500).json({ message: "Failed to update book." });
    }
});
exports.updateBook = updateBook;
const deleteBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield book_model_1.default.findByIdAndDelete(req.params.id);
        if (!book) {
            res.status(404).json({ message: "Book not found." });
            return;
        }
        res.json({ message: "Book deleted." });
    }
    catch (_a) {
        res.status(500).json({ message: "Failed to delete book." });
    }
});
exports.deleteBook = deleteBook;
