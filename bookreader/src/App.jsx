import { useEffect, useState } from "react";
import "./App.css";

const API = "https://bookreader-backend.onrender.com/books";

function App() {
  const [books, setBooks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [bookName, setBookName] = useState("");
  const [author, setAuthor] = useState("");
  const [desc, setDesc] = useState("");
  const [age, setAge] = useState("15");
  const [genre, setGenre] = useState("Education");

  // Fetch all books
  const fetchBooks = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Add or Update Book
  const addOrUpdateBook = async () => {
    if (!bookName || !author || !desc) {
      alert("Please fill all details!");
      return;
    }

    const bookData = { name: bookName, author, desc, age, genre, completed: false };

    if (editId) {
      // Update
      await fetch(`${API}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      });
      setEditId(null);
    } else {
      // Add
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      });
    }

    clearForm();
    fetchBooks();
  };

  // Complete book
  const toggleComplete = async (id, completed) => {
    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });
    fetchBooks();
  };

  // Delete book
  const deleteBook = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchBooks();
  };

  // Edit book
  const editBook = (book) => {
    setBookName(book.name);
    setAuthor(book.author);
    setDesc(book.desc);
    setAge(book.age);
    setGenre(book.genre);
    setEditId(book._id);
  };

  // Clear form
  const clearForm = () => {
    setBookName("");
    setAuthor("");
    setDesc("");
    setAge("15");
    setGenre("Education");
  };

  const totalBooks = books.length;
  const completedBooks = books.filter((b) => b.completed).length;

  return (
    <div className="container">
      <div className="book-container">
        <div className="header">
          <h1 className="animate-rotate">📚 MY LIST BOOK</h1>
          <p className="tagline">Read, Learn & Grow! 📖</p>
        </div>

        <div className="input-area">
          <input
            type="text"
            placeholder="Book Name"
            value={bookName}
            onChange={(e) => setBookName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Author Name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <textarea
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <select value={age} onChange={(e) => setAge(e.target.value)}>
            <option value="15">15+</option>
            <option value="20">20+</option>
            <option value="30">30+</option>
            <option value="40">40+</option>
            <option value="60">60+</option>
          </select>
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="Education">📘 Education</option>
            <option value="History">📜 History</option>
            <option value="Fantasy">🧙‍♂️ Fantasy</option>
            <option value="Science Fiction">🚀 Science Fiction</option>
            <option value="Mystery">🕵️‍♂️ Mystery</option>
            <option value="Horror">👻 Horror</option>
            <option value="Romance">❤️ Romance</option>
            <option value="Thriller">🔪 Thriller</option>
          </select>
          <button onClick={addOrUpdateBook}>
            {editId ? "Update Book" : "➕ Add Book"}
          </button>
        </div>

        <div className="stats">
          <p>Total: {totalBooks}</p>
          <p>Completed: {completedBooks}</p>
        </div>

        <ul id="booklist">
          {books.map((book) => (
            <li key={book._id} className={book.completed ? "completed" : ""}>
              <button onClick={() => toggleComplete(book._id, book.completed)}>
                {book.completed ? "✅" : "⬜"}
              </button>
              <span>
                📚 <b>{book.name}</b> by {book.author} <br />
                📝 {book.desc} <br />
                🎯 Age: {book.age}+ | Genre: {book.genre}
              </span>
              <button onClick={() => editBook(book)}>✏️</button>
              <button onClick={() => deleteBook(book._id)}>🗑️</button>
            </li>
          ))}
        </ul>

        <div className="footer">
          <h3 className="animate__animated animate__lightSpeedInRight">
            📖 Featured Books
          </h3>
          <div className="footer-book">
            <p>📚 <b>The Alchemist</b></p>
            <p>✍️ Author: Paulo Coelho</p>
            <p>💬 Quote: "It's the possibility of having a dream come true that makes life interesting."</p>
          </div>
          <div className="footer-book">
            <p>📚 <b>1984</b></p>
            <p>✍️ Author: George Orwell</p>
            <p>💬 Quote: "Big Brother is Watching You."</p>
          </div>
          <div className="footer-book">
            <p>📚 <b>Harry Potter</b></p>
            <p>✍️ Author: J.K. Rowling</p>
            <p>💬 Quote: "It is our choices that show what we truly are, far more than our abilities."</p>
          </div>
          <div className="footer-book">
            <p>📚 <b>Pride and Prejudice</b></p>
            <p>✍️ Author: Jane Austen</p>
            <p>💬 Quote: "I declare after all there is no enjoyment like reading!"</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;