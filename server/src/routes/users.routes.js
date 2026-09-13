const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/formbarAuth.middleware')

// just returns whoever the session belongs to, frontend uses this to check login state
router.get('/me', requireAuth, (req, res) => {
  res.json(req.user)
})

module.exports = router
