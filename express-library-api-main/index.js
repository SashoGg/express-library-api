const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./database.sqlite');

app.use(cors());
app.use(bodyParser.json());

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS students (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, grade INTEGER)");
});

app.get('/api/students', (req, res) => {
    db.all("SELECT * FROM students", [], (err, rows) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(rows);
    });
});

app.post('/api/students', (req, res) => {
    const { name, grade } = req.body;
    const numGrade = parseInt(grade);
    
    // VALIDATION: Check if grade is between 2 and 6
    if (!name || isNaN(numGrade)) {
        return res.status(400).json({ message: "Name and Grade are required" });
    }
    if (numGrade < 2 || numGrade > 6) {
        return res.status(400).json({ message: "Grade must be between 2 and 6" });
    }

    const query = "INSERT INTO students (name, grade) VALUES (?, ?)";
    db.run(query, [name, numGrade], function(err) {
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).json({ id: this.lastID, name, grade: numGrade });
    });
});

app.delete('/api/students/:id', (req, res) => {
    db.run("DELETE FROM students WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json({ message: "Deleted" });
    });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, user) => {
        if (err || !user) return res.status(401).json({ message: "Invalid login" });
        res.json({ username: user.username });
    });
});

app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, password], (err) => {
        if (err) return res.status(400).json({ message: "Username taken" });
        res.status(201).json({ message: "Success" });
    });
});

app.listen(3000, () => console.log('Backend running on http://localhost:3000'));