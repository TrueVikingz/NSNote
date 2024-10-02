const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('notes_database.db');

db.serialize(() => {
    const stmt = db.prepare('INSERT INTO notes (writer, viewers, content) VALUES (?, ?, ?)');

    // Insert sample notes
    stmt.run('Alice', 'Bob, Charlie', 'This is a note for my friends.');
    stmt.run('Bob', 'Alice', 'This is another note for Alice.');
    stmt.run('Charlie', 'Alice, Bob', 'This is a shared note.');

    stmt.finalize();
});

db.close(() => {
    console.log('Sample data inserted and database connection closed.');
});
