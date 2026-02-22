const API = "http://localhost:3000/books";

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
let editId = null; // 🔥 important for edit mode

function updateStats() {
    totalSpan.textContent = books.length;
    completedSpan.textContent = books.filter(b => b.completed).length;
}

// ================= FETCH ALL =================
async function fetchBooks() {
    const res = await fetch(API);
    const data = await res.json();

    books = data;
    bookList.innerHTML = "";
    books.forEach(renderBook);
    updateStats();
}

// ================= ADD OR UPDATE =================
addBtn.addEventListener("click", async function () {

    const bookData = {
        name: bookNameInput.value,
        author: authorInput.value,
        desc: descInput.value,
        age: ageSelect.value,
        genre: genreSelect.value
    };

    if (!bookData.name || !bookData.author || !bookData.desc) {
        alert("Please fill all details!");
        return;
    }

    if (editId) {
        // 🔥 UPDATE
        await fetch(`${API}/${editId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookData)
        });

        editId = null;
        addBtn.textContent = "Add Book";
    } else {
        // 🔥 CREATE
        await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...bookData, completed: false })
        });
    }

    clearForm();
    fetchBooks();
});

// ================= RENDER =================
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
    completeBtn.textContent = "✅";
    completeBtn.onclick = async function () {
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
    editBtn.onclick = function () {
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
    deleteBtn.onclick = async function () {
        await fetch(`${API}/${book._id}`, {
            method: "DELETE"
        });
        fetchBooks();
    };

    if (book.completed) {
        li.classList.add("completed");
    }

    li.appendChild(completeBtn);
    li.appendChild(info);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    bookList.appendChild(li);
}

// ================= CLEAR FORM =================
function clearForm() {
    bookNameInput.value = "";
    authorInput.value = "";
    descInput.value = "";
    ageSelect.value = "";
    genreSelect.value = "";
}

// ================= LOAD ON REFRESH =================
fetchBooks();

// ================= THEME =================
themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark");
    themeToggle.textContent =
        document.body.classList.contains("dark") ? "☀" : "🌙";
});