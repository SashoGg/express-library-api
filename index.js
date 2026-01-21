require('dotenv').config(); // 1. Load environment variables first
const express = require('express');
const { createHash } = require('node:crypto');

const app = express(); //

const port = process.env.PORT || 3000;

app.use(express.json()); // 3. Now you can use 'app'

// --- DATA ---
let books = [
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
    { id: 2, title: "1984", author: "George Orwell" },
    { id: 3, title: "To Kill a Mockingbird", author: "Harper Lee" }
];

// --- SECURITY SYSTEM ---

// 1. Helper function to hash passwords
// We use SHA-256 to turn "password123" into a long random string
const hashPassword = (password) => {
    return createHash('sha256').update(password).digest('hex');
};

// 2. Administrators Array (Username + Hashed Password)
// The password below is the hash for: "admin123"
const admins = [
    { 
        username: "admin", 
        password: "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9" 
    }
];

// 3. Session State
// (In a real app, use 'express-session' with process.env.SESSION_SECRET)
let currentSessionUser = null; 

// 4. Middleware: isAuthenticated
const isAuthenticated = (req, res, next) => {
    if (currentSessionUser) {
        next();
    } else {
        res.status(401).send("Unauthorized: You must login first.");
    }
};

// --- ENDPOINTS ---

app.get('/', (req, res) => {
    res.redirect('/books');
});

// LOGIN (Updated for Step 3)
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // 1. Hash the password the user just sent us
    const hashedPassword = hashPassword(password);

    // 2. Find if this user exists and the hashes match
    const user = admins.find(u => u.username === username && u.password === hashedPassword);

    if (user) {
        currentSessionUser = user.username;
        res.send(`Login successful! Welcome, ${user.username}.`);
    } else {
        res.status(401).send("Invalid username or password");
    }
});

app.post('/logout', (req, res) => {
    currentSessionUser = null;
    res.send("Logout successful.");
});

// PUBLIC ROUTES
app.get('/books', (req, res) => {
    res.json(books);
});

app.get('/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = books.find(b => b.id === bookId);
    if (book) res.json(book);
    else res.status(404).send('Book not found');
});

// PROTECTED ROUTES (Using 'isAuthenticated')
app.post('/books', isAuthenticated, (req, res) => {
    const newBook = {
        id: books.length + 1,
        title: req.body.title,
        author: req.body.author
    };
    books.push(newBook);
    res.status(201).json(newBook);
});

app.delete('/books/:id', isAuthenticated, (req, res) => {
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