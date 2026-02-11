const Database = require("better-sqlite3");
const auditRepo = require("../db/auditRepo");

// Open (or create) database file
const db = new Database("stores.db");

// Create table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS stores (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    namespace TEXT NOT NULL,
    created_at TEXT NOT NULL
  )
`).run();

module.exports = {
  create(store) {
    db.prepare(`
      INSERT INTO stores (id, type, status, namespace, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      store.id,
      store.type,
      store.status,
      store.namespace,
      store.createdAt
    );
  },

  list() {
    return db.prepare(`
      SELECT * FROM stores
      ORDER BY created_at DESC
    `).all();
  },

  get(id) {
    return db.prepare(`
      SELECT * FROM stores WHERE id = ?
    `).get(id);
  },

  updateStatus(id, status) {
    db.prepare(`
      UPDATE stores SET status = ? WHERE id = ?
    `).run(status, id);
  },

  delete(id) {
    db.prepare(`
      DELETE FROM stores WHERE id = ?
    `).run(id);
  }
};
