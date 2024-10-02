const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');  // This line imports the db.js file correctly

const app = express();
app.use(bodyParser.json());

// Get all notes
app.get('/notes', (req, res) => {
    db.all('SELECT * FROM notes', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Get a specific note by ID
app.get('/notes/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM notes WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'Note not found' });
        }
    });
});

// Add a new note
app.post('/notes', (req, res) => {
    const { writer, viewers, content } = req.body;
    if (!writer || !viewers || !content) {
        return res.status(400).json({ error: 'Writer, viewers, and content are required' });
    }

    db.run(
        'INSERT INTO notes (writer, viewers, content) VALUES (?, ?, ?)',
        [writer, viewers, content],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(201).json({
                    id: this.lastID,
                    writer,
                    viewers,
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
