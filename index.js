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

// This function connects to the DB and sets up tables if they don't exist
async function initializeDB() {
    db = await open({
        filename: 'database.sqlite',
        driver: sqlite3.Database
    });

    console.log('Connected to SQLite database.');

    // Create Books Table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            author TEXT
        )
    `);

    // Create Users Table (Replacing the admins array)
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            salt TEXT
        )
    `);
}

// Initialize the DB immediately
initializeDB().catch(err => {
    console.error("Failed to initialize DB:", err);
});

// --- SECURITY HELPERS ---

const hashPassword = (password, salt) => {
    return createHash('sha256').update(password + salt).digest('hex');
};

let currentSessionUser = null; 

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

// REGISTER (Now saves to DB)
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Check if user exists
    const existingUser = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    if (existingUser) {
        return res.status(400).send("User already exists.");
    }

    const salt = randomBytes(16).toString('hex');
    const hashedPassword = hashPassword(password, salt);

    // INSERT into database
    await db.run(
        'INSERT INTO users (username, password, salt) VALUES (?, ?, ?)',
        [username, hashedPassword, salt]
    );
    
    res.status(201).send(`User ${username} registered successfully!`);
});

// LOGIN (Now checks DB)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Get user from DB
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

// --- BOOK ENDPOINTS (Now using DB) ---

// 4.1 Get all objects
app.get('/books', async (req, res) => {
    const books = await db.all('SELECT * FROM books');
    res.json(books);
});

// 4.2 Get object by ID
app.get('/books/:id', async (req, res) => {
    const book = await db.get('SELECT * FROM books WHERE id = ?', [req.params.id]);
    
    if (book) {
        res.json(book);
    } else {
        res.status(404).send('Book not found');
    }
});

// 4.3 Add object (Protected)
app.post('/books', isAuthenticated, async (req, res) => {
    const { title, author } = req.body;
    
    // Run the INSERT and get the result (so we know the new ID)
    const result = await db.run(
        'INSERT INTO books (title, author) VALUES (?, ?)',
        [title, author]
    );

    res.status(201).json({
        id: result.lastID, // The DB generates the ID now
        title,
        author
    });
});

// 4.4 Delete object (Protected)
app.delete('/books/:id', isAuthenticated, async (req, res) => {
    const result = await db.run('DELETE FROM books WHERE id = ?', [req.params.id]);

    if (result.changes > 0) {
        res.send(`Book with ID ${req.params.id} deleted.`);
    } else {
        res.status(404).send('Book not found');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});