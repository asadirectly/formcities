const config = require('../config/env')
const Site = require('../models/Site')

// adds up all the sites a user owns and checks it against the total quota
function getTotalUsage(userId) {
  const sites = Site.findByUser(userId)
  return sites.reduce((sum, site) => sum + (site.size_bytes || 0), 0)
}

function hasRoomFor(userId, newBytes) {
  const current = getTotalUsage(userId)
  return (current + newBytes) <= config.maxTotalStudentBytes
}

module.exports = { getTotalUsage, hasRoomFor }
