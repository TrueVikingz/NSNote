const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database (or create it if it doesn't exist)
const db = new sqlite3.Database('notes_database.db', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Create the "notes" table if it doesn't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        writer TEXT NOT NULL,
        viewers TEXT NOT NULL,
        content TEXT NOT NULL
    )`);
});

module.exports = db;
