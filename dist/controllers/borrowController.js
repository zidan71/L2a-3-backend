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
exports.getBorrowSummary = exports.borrowBook = void 0;
const borrow_model_1 = __importDefault(require("../models/borrow.model"));
const book_model_1 = __importDefault(require("../models/book.model"));
const borrowBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const book = yield book_model_1.default.findById(bookId);
        if (!book) {
            res.status(404).json({ message: "Book not found." });
            return;
        }
        if (book.copies < quantity) {
            res.status(400).json({ message: "Not enough copies available." });
            return;
        }
        const borrow = new borrow_model_1.default({
            book: bookId,
            quantity,
            dueDate,
        });
        yield borrow.save();
        book.copies -= quantity;
        if (book.copies <= 0) {
            book.available = false;
        }
        yield book.save();
        res.status(201).json({ message: "Book borrowed successfully.", borrow });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to borrow book." });
    }
});
exports.borrowBook = borrowBook;
const getBorrowSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const summary = yield borrow_model_1.default.aggregate([
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to get borrow summary." });
    }
});
exports.getBorrowSummary = getBorrowSummary;
