const fs = require('fs')
const path = require('path')
const config = require('../config/env')
const Site = require('../models/Site')
const scanner = require('../services/siteScanner')
const quota = require('../services/quota.service')
const formbar = require('../services/formbarClient')

const sitesRoot = path.resolve(__dirname, '../../', config.sitesDir)

function listSites(req, res) {
  res.json(Site.listPublished())
}

function getMySites(req, res) {
  res.json(Site.findByUser(req.user.id))
}

async function uploadSite(req, res) {
  const files = req.files
  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'no files uploaded' })
  }

  const slug = req.body.slug
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return res.status(400).json({ error: 'slug must be lowercase letters, numbers, and hyphens only' })
  }

  const pin = req.body.pin
  if (!pin) {
    return res.status(400).json({ error: 'your formbar digipog pin is required to pay the hosting fee' })
  }

  // check quota before we charge anyone or write anything to disk
  const totalSize = files.reduce((sum, f) => sum + f.size, 0)
  if (!quota.hasRoomFor(req.user.id, totalSize)) {
    return res.status(413).json({ error: 'this would put you over your storage quota' })
  }

  // scan js files for obviously sketchy stuff before accepting the upload
  // note this is just a first filter, the real protection is origin isolation (see nginx config)
  const problems = scanner.scanUpload(files)
  if (problems.length > 0) {
    return res.status(400).json({ error: 'upload rejected by security scan', details: problems })
  }

  const existing = Site.findBySlug(slug)
  if (existing && existing.formbar_user_id !== req.user.id) {
    return res.status(409).json({ error: 'that slug belongs to someone else' })
  }

  // charge the hosting fee into the pool instead of a specific person
  // do this AFTER all the free checks above so students aren't charged for a
  // request that was going to get rejected anyway
  let chargeResult
  try {
    chargeResult = await formbar.chargeHostingFee(req.user.id, pin, `FormCities hosting: ${slug}`)
  } catch (err) {
    return res.status(502).json({ error: `couldn't reach formbar to charge the hosting fee: ${err.message}` })
  }

  if (!chargeResult.success) {
    return res.status(402).json({ error: chargeResult.message || 'digipog payment failed, check your pin and balance' })
  }

  const siteDir = path.join(sitesRoot, slug)
  fs.mkdirSync(siteDir, { recursive: true })

  for (const file of files) {
    // basename strips any sneaky ../ path stuff from the filename
    const safeName = path.basename(file.originalname)
    fs.writeFileSync(path.join(siteDir, safeName), file.buffer)
  }

  if (!existing) {
    Site.createSite(req.user.id, req.user.username, slug, req.body.title || slug)
  }
  Site.updateSize(slug, totalSize)

  res.json({ ok: true, slug })
}

function deleteSite(req, res) {
  const { slug } = req.params
  const site = Site.findBySlug(slug)

  if (!site || site.formbar_user_id !== req.user.id) {
    return res.status(404).json({ error: 'site not found' })
  }

  const siteDir = path.join(sitesRoot, slug)
  fs.rmSync(siteDir, { recursive: true, force: true })
  Site.setPublished(slug, false) // TODO: maybe actually delete the db row instead of just unpublishing

  res.json({ ok: true })
}

module.exports = { listSites, getMySites, uploadSite, deleteSite }
