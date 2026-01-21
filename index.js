require('dotenv').config();
const express = require('express');
const { createHash, randomBytes } = require('node:crypto');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// --- DATABASE SETUP ---
let db;

async function initializeDB() {
    db = await open({
        filename: 'database.sqlite',
        driver: sqlite3.Database
    });

    // Enable Foreign Keys (Required for relationships to work!)
    await db.exec('PRAGMA foreign_keys = ON;');

    console.log('Connected to SQLite database.');

    // 1. Users Table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            salt TEXT
        )
    `);

    // 2. Books Table (Parent)
    await db.exec(`
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            author TEXT
        )
    `);

    // 3. Reviews Table (Child) - Linked to Books
    await db.exec(`
        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT,
            rating INTEGER,
            book_id INTEGER,
            FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE
        )
    `);
}

// Start DB immediately
initializeDB().catch(err => {
    console.error("Failed to initialize DB:", err);
});

// --- SECURITY HELPERS ---

// Helper: Hash password + salt
const hashPassword = (password, salt) => {
    return createHash('sha256').update(password + salt).digest('hex');
};

// Session Simulation (In a real app, use express-session)
let currentSessionUser = null; 

// Middleware: Protect Routes
const isAuthenticated = (req, res, next) => {
    if (currentSessionUser) {
        next();
    } else {
        res.status(401).send("Unauthorized: You must login first.");
    }
};

// --- AUTH ENDPOINTS ---

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await db.get('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUser) return res.status(400).send("User already exists.");

        const salt = randomBytes(16).toString('hex');
        const hashedPassword = hashPassword(password, salt);

        await db.run(
            'INSERT INTO users (username, password, salt) VALUES (?, ?, ?)',
            [username, hashedPassword, salt]
        );
        res.status(201).send(`User ${username} registered successfully!`);
    } catch (e) {
        res.status(500).send("Error registering user");
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);

    if (user) {
        const loginHash = hashPassword(password, user.salt);
        if (loginHash === user.password) {
            currentSessionUser = user.username;
            return res.send(`Login successful! Welcome, ${user.username}.`);
        }
    }
    res.status(401).send("Invalid username or password");
});

app.post('/logout', (req, res) => {
    currentSessionUser = null;
    res.send("Logout successful.");
});

// --- BOOK ENDPOINTS ---

// Home Redirect
app.get('/', (req, res) => {
    res.redirect('/books');
});

// Get All Books
app.get('/books', async (req, res) => {
    const books = await db.all('SELECT * FROM books');
    res.json(books);
});

// Get Book by ID
app.get('/books/:id', async (req, res) => {
    const book = await db.get('SELECT * FROM books WHERE id = ?', [req.params.id]);
    if (book) res.json(book);
    else res.status(404).send('Book not found');
});

// Add Book (Protected)
app.post('/books', isAuthenticated, async (req, res) => {
    const { title, author } = req.body;
    const result = await db.run(
        'INSERT INTO books (title, author) VALUES (?, ?)',
        [title, author]
    );
    res.status(201).json({ id: result.lastID, title, author });
});

// Delete Book (Protected)
app.delete('/books/:id', isAuthenticated, async (req, res) => {
    const result = await db.run('DELETE FROM books WHERE id = ?', [req.params.id]);
    if (result.changes > 0) res.send(`Book with ID ${req.params.id} deleted.`);
    else res.status(404).send('Book not found');
});

// --- REVIEW ENDPOINTS (New!) ---

// Add Review (Protected)
app.post('/reviews', isAuthenticated, async (req, res) => {
    const { text, rating, book_id } = req.body;

    try {
        const result = await db.run(
            'INSERT INTO reviews (text, rating, book_id) VALUES (?, ?, ?)',
            [text, rating, book_id]
        );
        res.status(201).json({ id: result.lastID, text, rating, book_id });
    } catch (error) {
        // SQLite foreign key constraint failed
        res.status(400).send("Error: Book ID likely does not exist.");
    }
});

// Delete Review (Protected)
app.delete('/reviews/:id', isAuthenticated, async (req, res) => {
    const result = await db.run('DELETE FROM reviews WHERE id = ?', [req.params.id]);
    if (result.changes > 0) res.send(`Review with ID ${req.params.id} deleted.`);
    else res.status(404).send('Review not found');
});

// Get Reviews for a specific Book
app.get('/books/:id/reviews', async (req, res) => {
    const reviews = await db.all('SELECT * FROM reviews WHERE book_id = ?', [req.params.id]);
    res.json(reviews);
});

// Start Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});