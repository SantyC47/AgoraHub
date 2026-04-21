import Database from 'better-sqlite3';

//Crear o conectar a la BD
const db = new Database('chat.db');

//Crear tabla
db.prepare(`
  CREATE TABLE IF NOT EXISTS mensajes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

export default db;