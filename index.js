require('dotenv').config();
const express = require('express');
// Import randomBytes to generate unique salts
const { createHash, randomBytes } = require('node:crypto');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// --- DATA ---
let books = [
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
    { id: 2, title: "1984", author: "George Orwell" },
    { id: 3, title: "To Kill a Mockingbird", author: "Harper Lee" }
];

// --- SECURITY SYSTEM (Enhanced with Salting) ---

// 1. Helper: Hash Password with Salt
// We combine the password AND the random salt before hashing
const hashPassword = (password, salt) => {
    return createHash('sha256').update(password + salt).digest('hex');
};

// 2. Administrators Array
// We start empty. You must use /register to create a user!
const admins = [];

let currentSessionUser = null; 

// 3. Middleware: isAuthenticated
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

// NEW: REGISTER (Optional Task 1)
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Check if user already exists
    if (admins.find(u => u.username === username)) {
        return res.status(400).send("User already exists.");
    }

    // 1. Generate a random unique salt for this user
    const salt = randomBytes(16).toString('hex');

    // 2. Hash the password combined with the salt
    const hashedPassword = hashPassword(password, salt);

    // 3. Store everything (including the salt!)
    const newUser = { 
        username, 
        password: hashedPassword, 
        salt 
    };
    
    admins.push(newUser);
    res.status(201).send(`User ${username} registered successfully!`);
});

// LOGIN (Updated for Salt)
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = admins.find(u => u.username === username);

    if (user) {
        // 1. Grab the salt WE SAVED when this user registered
        const storedSalt = user.salt;

        // 2. Hash the input password with that specific salt
        const loginHash = hashPassword(password, storedSalt);

        // 3. Compare the new hash with the stored hash
        if (loginHash === user.password) {
            currentSessionUser = user.username;
            return res.send(`Login successful! Welcome, ${user.username}.`);
        }
    }

    // If user not found OR password doesn't match
    res.status(401).send("Invalid username or password");
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

// PROTECTED ROUTES
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