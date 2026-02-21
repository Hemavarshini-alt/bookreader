const API = "http://localhost:3000/books";
let books = [];

let quotes = [
  "📖 A reader lives a thousand lives.",
  "📚 Books are a uniquely portable magic.",
  "✨ Reading is dreaming with open eyes.",
  "📘 Today a reader, tomorrow a leader."
];

document.getElementById("quote").innerText =
  quotes[Math.floor(Math.random() * quotes.length)];

/* ---------------- FETCH ALL BOOKS ---------------- */
async function fetchBooks() {
  const res = await fetch(API);
  books = await res.json();
  renderBooks();
}

fetchBooks();

/* ---------------- THEME ---------------- */
function toggleTheme(){
  document.body.classList.toggle("dark");
}

/* ---------------- ADD BOOK ---------------- */
async function addBook(){
  let title = document.getElementById("title").value;
  let author = document.getElementById("author").value;
  let description = document.getElementById("description").value;
  let age = document.getElementById("age").value;
  let genre = document.getElementById("genre").value;

  if(!title || !author || !description || !age || !genre){
    alert("⚠ Please fill all fields!");
    return;
  }

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, author, description, age, genre })
  });

  clearForm();
  fetchBooks();
}

/* ---------------- RENDER ---------------- */
function renderBooks(){
  let list = document.getElementById("bookList");
  list.innerHTML="";

  books.forEach(book => {
    let div=document.createElement("div");
    div.className="book-card";
    if(book.completed) div.classList.add("completed");

    div.innerHTML=`
      <h3>📘 ${book.title}</h3>
      <p>✍ ${book.author}</p>
      <p>📝 ${book.description}</p>
      <p>👥 Age: ${book.age}</p>
      <p>🏷 ${book.genre}</p>
      <button onclick="completeBook('${book._id}')">✅ Complete</button>
      <button onclick="editBook('${book._id}')">✏ Edit</button>
      <button onclick="deleteBook('${book._id}')">🗑 Delete</button>
    `;

    list.appendChild(div);
  });

  document.getElementById("total").innerText = books.length;
  document.getElementById("completed").innerText =
    books.filter(b=>b.completed).length;
}

/* ---------------- COMPLETE ---------------- */
async function completeBook(id){
  await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: true })
  });

  fetchBooks();
  showToast();
}

/* ---------------- DELETE ---------------- */
async function deleteBook(id){
  await fetch(`${API}/${id}`, {
    method: "DELETE"
  });

  fetchBooks();
}

/* ---------------- EDIT ---------------- */
function editBook(id){
  const book = books.find(b => b._id === id);

  document.getElementById("title").value = book.title;
  document.getElementById("author").value = book.author;
  document.getElementById("description").value = book.description;
  document.getElementById("age").value = book.age;
  document.getElementById("genre").value = book.genre;

  deleteBook(id);
}

/* ---------------- CLEAR FORM ---------------- */
function clearForm(){
  document.getElementById("title").value="";
  document.getElementById("author").value="";
  document.getElementById("description").value="";
  document.getElementById("age").value="";
  document.getElementById("genre").value="";
}

/* ---------------- TOAST ---------------- */
function showToast(){
  let toast=document.getElementById("toast");
  toast.style.display="block";
  setTimeout(()=>{toast.style.display="none";},2000);
}