// book.js

// DOM elements
const bookNameInput = document.getElementById("book-name");
const authorInput = document.getElementById("author-name");
const descInput = document.getElementById("book-desc");
const ageSelect = document.getElementById("age-group");
const genreSelect = document.getElementById("genre");
const addBtn = document.getElementById("add-btn");
const bookList = document.getElementById("booklist");
const totalSpan = document.getElementById("total");
const completedSpan = document.getElementById("completed");
const themeToggle = document.getElementById("theme-toggle");

const API_URL = "http://localhost:3000/books";

// 1. Fetch all books from MongoDB on load
async function fetchBooks() {
    try {
        const response = await fetch(API_URL);
        const books = await response.json();
        bookList.innerHTML = ""; // Clear list
        books.forEach(renderBook);
        updateStats(books);
    } catch (err) {
        console.error("Error fetching books:", err);
    }
}

// 2. Update Stats (Now takes books array as argument)
function updateStats(books) {
    totalSpan.textContent = books.length;
    completedSpan.textContent = books.filter(b => b.completed).length;
}

// 3. Render a single book
function renderBook(book) {
    const li = document.createElement("li");
    li.className = "book-item";
    if (book.completed) li.classList.add("completed");

    li.innerHTML = `
        <div class="book-info">
            📚 <b>${book.name}</b> by ✍️ ${book.author}<br>
            📝 ${book.desc}<br>
            🎯 Age: ${book.age}+ | Genre: ${book.genre}
        </div>
        <div class="book-buttons">
            <button class="complete-btn">${book.completed ? "✅" : "✔️"}</button>
            <button class="edit-btn">✏️</button>
            <button class="delete-btn">🗑️</button>
        </div>
    `;

    // --- Button Logic with API Calls ---

    // Toggle Complete (PUT)
    li.querySelector(".complete-btn").onclick = async () => {
        try {
            await fetch(`${API_URL}/${book._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ completed: !book.completed })
            });
            fetchBooks(); // Refresh list
        } catch (err) { console.error(err); }
    };

    // Delete (DELETE)
    li.querySelector(".delete-btn").onclick = async () => {
        try {
            await fetch(`${API_URL}/${book._id}`, { method: "DELETE" });
            fetchBooks(); // Refresh list
        } catch (err) { console.error(err); }
    };

    // Edit (Pre-fill form and Delete from DB)
    li.querySelector(".edit-btn").onclick = async () => {
        bookNameInput.value = book.name;
        authorInput.value = book.author;
        descInput.value = book.desc;
        ageSelect.value = book.age;
        genreSelect.value = book.genre;
        
        await fetch(`${API_URL}/${book._id}`, { method: "DELETE" });
        fetchBooks();
    };

    bookList.appendChild(li);
}

// 4. Add book button (POST)
addBtn.addEventListener("click", async () => {
    const bookData = {
        name: bookNameInput.value.trim(),
        author: authorInput.value.trim(),
        desc: descInput.value.trim(),
        age: ageSelect.value,
        genre: genreSelect.value,
        completed: false
    };

    if (!bookData.name || !bookData.author || !bookData.desc) {
        alert("⚠️ Please fill in all book details!");
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookData)
        });

        if (response.ok) {
            // Reset form
            bookNameInput.value = "";
            authorInput.value = "";
            descInput.value = "";
            fetchBooks(); // Refresh UI
        }
    } catch (err) {
        console.error("Error saving book:", err);
    }
});

// Initial load
fetchBooks();

// Theme toggle
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});
