const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');  // Ensure this is the correct path
const path = require('path'); // Import path for serving static files

const app = express();
app.use(bodyParser.json());

// Serve static files from the CSS directory
app.use('/CSS', express.static(path.join(__dirname, 'CSS'))); // Serve static files from the 'CSS' directory

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'\NSNote', 'Main.html')); // Serve Main.html at the root
});

app.get('/new', (req, res) => {
    res.sendFile(path.join(__dirname,'\NSNote', 'NewNote.html')); // Serve NewNote.html
});

app.get('/list', (req, res) => {
    res.sendFile(path.join(__dirname,'\NSNote', 'List.html')); // Serve List.html
});

// API endpoint to get all notes in JSON format
app.get('/api/notes', (req, res) => {
    db.all('SELECT * FROM notes', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Add a new note
app.post('/api/notes', (req, res) => {
    const { writer, visible_to, content } = req.body; // Ensure these fields are sent in the request
    if (!writer || !visible_to || !content) {
        return res.status(400).json({ error: 'Writer, visible_to, and content are required' });
    }

    db.run(
        'INSERT INTO notes (writer, visible_to, content) VALUES (?, ?, ?)',
        [writer, visible_to, content],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(201).json({
                    id: this.lastID, // Get the ID of the newly created note
                    writer,
                    visible_to,
                    content,
                });
            }
        }
    );
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
