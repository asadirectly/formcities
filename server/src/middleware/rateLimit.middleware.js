const rateLimit = require('express-rate-limit')

// stops someone from hammering the upload endpoint with a script
// numbers are a starting point, tweak based on class size
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20,
  message: { error: 'too many uploads, slow down and try again later' }
})

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'too many login attempts, try again later' }
})

module.exports = { uploadLimiter, loginLimiter }
