const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(
  path.join(__dirname, "../../stores.db")
);

db.run(`
  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    store_id TEXT,
    action TEXT,
    ip TEXT,
    status TEXT,
    message TEXT,
    created_at TEXT
  )
`);

function log({ storeId, action, ip, status, message }) {
  db.run(
    `INSERT INTO audit_logs 
     (store_id, action, ip, status, message, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      storeId,
      action,
      ip,
      status,
      message,
      new Date().toISOString(),
    ]
  );
}

function list() {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM audit_logs ORDER BY created_at DESC`, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

module.exports = { log, list };
