const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Book = require("./model/read"); // schema

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection -  mongodb+srv://Hemavarshini:Hemavarshini@cluster0.m86owho.mongodb.net/bookreader?appName=Cluster0
mongoose.connect("mongodb+srv://Hemavarshini:Hemavarshini@cluster0.m86owho.mongodb.net/bookreader?appName=Cluster0")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ MongoDB Error:", err));

// CRUD ROUTES

// CREATE
app.post("/books", async (req, res) => {
    try {
        const newBook = new Book(req.body);
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (err) {
        res.status(500).json({ message: "Error saving book" });
    }
});

// READ ALL
app.get("/books", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: "Error fetching books" });
    }
});

// UPDATE
app.put("/books/:id", async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedBook) return res.status(404).json({ message: "Book not found" });
        res.json(updatedBook);
    } catch (err) {
        res.status(500).json({ message: "Error updating book" });
    }
});

// DELETE
app.delete("/books/:id", async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) return res.status(404).json({ message: "Book not found" });
        res.json({ message: "Book deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting book" });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));