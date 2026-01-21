const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// --- DATA ---
let books = [
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
    { id: 2, title: "1984", author: "George Orwell" },
    { id: 3, title: "To Kill a Mockingbird", author: "Harper Lee" }
];

// --- SECURITY SYSTEM (Exercise 2 & 3) ---

// 1. A simple variable to track login state (Simulated Database)
let isAdminLoggedIn = false;

// 2. Authentication Middleware
// This function acts as a "Guard" at the door.
const requireLogin = (req, res, next) => {
    if (isAdminLoggedIn) {
        next(); // User is logged in, let them pass!
    } else {
        res.status(401).send("Unauthorized: You must login first."); // Block them!
    }
};

// --- ENDPOINTS ---

// Root
app.get('/', (req, res) => {
    res.redirect('/books');
});

// LOGIN (Exercise 2)
app.post('/login', (req, res) => {
    // In a real app, you would check a database for username/password here.
    // For this exercise, we just trust the user wants to login.
    isAdminLoggedIn = true;
    res.send("Login successful! You can now add or delete books.");
});

// LOGOUT (Exercise 2)
app.post('/logout', (req, res) => {
    isAdminLoggedIn = false;
    res.send("Logout successful. Protected routes are now locked.");
});


// PUBLIC ROUTES (Anyone can see these)
app.get('/books', (req, res) => {
    res.json(books);
});

app.get('/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = books.find(b => b.id === bookId);
    if (book) res.json(book);
    else res.status(404).send('Book not found');
});


// PROTECTED ROUTES (Exercise 3)
// Notice we added 'requireLogin' before the (req, res) part.

// 4.3 Add object (Protected)
app.post('/books', requireLogin, (req, res) => {
    const newBook = {
        id: books.length + 1,
        title: req.body.title,
        author: req.body.author
    };
    books.push(newBook);
    res.status(201).json(newBook);
});

// 4.4 Delete object (Protected)
app.delete('/books/:id', requireLogin, (req, res) => {
    const bookId = parseInt(req.params.id);
    const bookIndex = books.findIndex(b => b.id === bookId);

    if (bookIndex > -1) {
        books.splice(bookIndex, 1);
        res.send(`Book with ID ${bookId} deleted.`);
    } else {
        res.status(404).send('Book not found');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});