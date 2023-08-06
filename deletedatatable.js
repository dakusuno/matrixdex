const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./md.db');

db.serialize(() => {
    db.run(`DELETE FROM chapter`);
});

db.close(); 