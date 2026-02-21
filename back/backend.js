// backend.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Create Express app
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());           // Enable CORS
app.use(express.json());   // Parse JSON bodies

// --- MongoDB Connection ---
mongoose.connect("mongodb+srv://Hemavarshini:Hemavarshini@cluster0.m86owho.mongodb.net/bookdb?appName=Cluster0")
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// --- Import Book Schema ---
const Book = require("./model/read"); // make sure this path matches your folder

// --- Routes ---

// GET all books
app.get("/books", async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST add new book
app.post("/books", async (req, res) => {
    try {
        const newBook = new Book(req.body); // expects name, author, desc, age, genre, completed
        await newBook.save();
        res.status(201).json(newBook);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update book (completed toggle or edit book info)
app.put("/books/:id", async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,  // MongoDB _id
            req.body,       // fields to update
            { new: true }   // return updated document
        );
        res.json(updatedBook);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE book
app.delete("/books/:id", async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.json({ message: "Book deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
const PORT =process.env.PORT || 3000;
// --- Start server ---
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});