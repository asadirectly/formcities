const express = require('express')
const router = express.Router()
const sitesController = require('../controllers/sites.controller')
const upload = require('../middleware/upload.middleware')
const { requireAuth } = require('../middleware/formbarAuth.middleware')
const { uploadLimiter } = require('../middleware/rateLimit.middleware')

router.get('/', sitesController.listSites) // public browse page
router.get('/mine', requireAuth, sitesController.getMySites)
router.post('/upload', requireAuth, uploadLimiter, upload.array('files'), sitesController.uploadSite)
router.delete('/:slug', requireAuth, sitesController.deleteSite)

module.exports = router
