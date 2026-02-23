const API = "https://bookreader-backend.onrender.com/books";

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

let books = [];
let editId = null;

// Update stats
function updateStats() {
    totalSpan.textContent = books.length;
    completedSpan.textContent = books.filter(b => b.completed).length;
}

// Fetch all books
async function fetchBooks() {
    const res = await fetch(API);
    const data = await res.json();
    books = data;
    bookList.innerHTML = "";
    books.forEach(renderBook);
    updateStats();
}

// Add or Update book
addBtn.addEventListener("click", async () => {
    const bookData = {
        name: bookNameInput.value.trim(),
        author: authorInput.value.trim(),
        desc: descInput.value.trim(),
        age: ageSelect.value,
        genre: genreSelect.value
    };

    if (!bookData.name || !bookData.author || !bookData.desc) {
        alert("Please fill all details!");
        return;
    }

    if (editId) {
        // UPDATE
        await fetch(`${API}/${editId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookData)
        });
        editId = null;
        addBtn.textContent = "➕ Add Book";
    } else {
        // CREATE
        await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...bookData, completed: false })
        });
    }

    clearForm();
    fetchBooks();
});

// Render book item
function renderBook(book) {
    const li = document.createElement("li");

    const info = document.createElement("span");
    info.innerHTML = `
        📚 <b>${book.name}</b> by ${book.author}<br>
        📝 ${book.desc}<br>
        🎯 Age: ${book.age}+ | Genre: ${book.genre}
    `;

    // COMPLETE
    const completeBtn = document.createElement("button");
    completeBtn.textContent = book.completed ? "✅" : "⬜";
    completeBtn.onclick = async () => {
        await fetch(`${API}/${book._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: !book.completed })
        });
        fetchBooks();
    };

    // EDIT
    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.onclick = () => {
        bookNameInput.value = book.name;
        authorInput.value = book.author;
        descInput.value = book.desc;
        ageSelect.value = book.age;
        genreSelect.value = book.genre;
        editId = book._id;
        addBtn.textContent = "Update Book";
    };

    // DELETE
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.onclick = async () => {
        await fetch(`${API}/${book._id}`, { method: "DELETE" });
        fetchBooks();
    };

    if (book.completed) li.classList.add("completed");

    li.appendChild(completeBtn);
    li.appendChild(info);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    bookList.appendChild(li);
}

// Clear form
function clearForm() {
    bookNameInput.value = "";
    authorInput.value = "";
    descInput.value = "";
    ageSelect.value = "15";
    genreSelect.value = "Education";
}

// Load on page load
fetchBooks();

// Theme toggle
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeToggle.textContent = document.body.classList.contains("dark") ? "☀" : "🌙";
});