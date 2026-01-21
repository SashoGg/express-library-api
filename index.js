const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// 3. Data Array
let books = [
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
    { id: 2, title: "1984", author: "George Orwell" },
    { id: 3, title: "To Kill a Mockingbird", author: "Harper Lee" }
];

// --- ENDPOINTS ---

// NEW: Root Route -> Redirects straight to /books
app.get('/', (req, res) => {
    res.redirect('/books');
});

// 4.1 Get all objects
app.get('/books', (req, res) => {
    res.json(books);
});

// 4.2 Get object by ID
app.get('/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = books.find(b => b.id === bookId);

    if (book) {
        res.json(book);
    } else {
        res.status(404).send('Book not found');
    }
});

// 4.3 Add object
app.post('/books', (req, res) => {
    const newBook = {
        id: books.length + 1,
        title: req.body.title,
        author: req.body.author
    };
    books.push(newBook);
    res.status(201).json(newBook);
});

// 4.4 Delete object
app.delete('/books/:id', (req, res) => {
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