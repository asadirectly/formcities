const express = require('express')
const router = express.Router()
const adminController = require('../controllers/admin.controller')
const { requireAuth, requireAdmin } = require('../middleware/formbarAuth.middleware')

router.use(requireAuth, requireAdmin) // everything below this needs a teacher/manager

router.post('/sites/:slug/unpublish', adminController.unpublishSite)
router.get('/site-owners', adminController.listSiteOwners)

module.exports = router
