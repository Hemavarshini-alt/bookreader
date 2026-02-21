const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Book = require("./model/read");

const app = express();
app.use(cors());
app.use(express.json());

/* ------------------ DATABASE CONNECTION ------------------ */
mongoose.connect("mongodb://127.0.0.1:27017/bookDB")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log(err));

/* ------------------ ROUTES ------------------ */

// GET all books
app.get("/books", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// ADD new book
app.post("/books", async (req, res) => {
  const newBook = new Book(req.body);
  await newBook.save();
  res.json(newBook);
});

// UPDATE book (complete/edit)
app.put("/books/:id", async (req, res) => {
  const updatedBook = await Book.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updatedBook);
});

// DELETE book
app.delete("/books/:id", async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: "Book deleted" });
});

app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});