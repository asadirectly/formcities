const multer = require('multer')
const path = require('path')
const config = require('../config/env')

// only these file types are allowed, anything else gets rejected
// the actual sandboxing happens in the static server / iframe setup
const allowedExtensions = new Set(['.html', '.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.txt', '.json'])

const storage = multer.memoryStorage() // keep files in memory, we write them out ourselves after checks

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase()
  if (!allowedExtensions.has(ext)) {
    return cb(new Error(`file type ${ext} isn't allowed`))
  }
  cb(null, true)
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.maxSiteSizeBytes,
    files: 25 // cap number of files per upload so nobody dumps a huge tree
  }
})

module.exports = upload
