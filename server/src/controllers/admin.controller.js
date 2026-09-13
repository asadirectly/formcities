const Site = require('../models/Site')
const db = require('../db/connection')

// simple moderation tools for a teacher to unpublish stuff without deleting it
function unpublishSite(req, res) {
  const { slug } = req.params
  const site = Site.findBySlug(slug)
  if (!site) return res.status(404).json({ error: 'site not found' })

  Site.setPublished(slug, false)
  res.json({ ok: true })
}

// there's no local users table anymore (formbar owns accounts), so this just
// lists whoever has actually published a site here, pulled from formbar_user_id
function listSiteOwners(req, res) {
  const owners = db.prepare(`
    SELECT DISTINCT formbar_user_id, owner_username FROM sites
  `).all()
  res.json(owners)
}

module.exports = { unpublishSite, listSiteOwners }
