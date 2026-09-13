const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')
const config = require('../config/env')

// make sure the data folder actually exists before sqlite tries to open a file in it
const dataDir = path.dirname(config.dbPath)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const db = new Database(config.dbPath)
db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS sites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    formbar_user_id INTEGER NOT NULL,
    owner_username TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    title TEXT,
    is_published INTEGER DEFAULT 1,
    size_bytes INTEGER DEFAULT 0,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`)

module.exports = db
