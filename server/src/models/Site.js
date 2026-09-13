const db = require('../db/connection')

function createSite(formbarUserId, ownerUsername, slug, title) {
  const stmt = db.prepare('INSERT INTO sites (formbar_user_id, owner_username, slug, title) VALUES (?, ?, ?, ?)')
  return stmt.run(formbarUserId, ownerUsername, slug, title).lastInsertRowid
}

function findBySlug(slug) {
  return db.prepare('SELECT * FROM sites WHERE slug = ?').get(slug)
}

function findByUser(formbarUserId) {
  return db.prepare('SELECT * FROM sites WHERE formbar_user_id = ?').all(formbarUserId)
}

function listPublished() {
  return db.prepare('SELECT * FROM sites WHERE is_published = 1 ORDER BY updated_at DESC').all()
}

function updateSize(slug, sizeBytes) {
  db.prepare('UPDATE sites SET size_bytes = ?, updated_at = CURRENT_TIMESTAMP WHERE slug = ?').run(sizeBytes, slug)
}

function setPublished(slug, published) {
  db.prepare('UPDATE sites SET is_published = ? WHERE slug = ?').run(published ? 1 : 0, slug)
}

module.exports = { createSite, findBySlug, findByUser, listPublished, updateSize, setPublished }
