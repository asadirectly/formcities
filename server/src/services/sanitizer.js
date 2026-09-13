const { JSDOM } = require('jsdom')
const createDOMPurify = require('dompurify')

const window = new JSDOM('').window
const DOMPurify = createDOMPurify(window)

// this is for any HTML we ever render OUTSIDE the sandboxed site iframe
// (like a site title or description shown on the browse page)
// do NOT use this as your only protection for the actual student html files,
// those get isolated on their own origin instead, sanitizing them would just break their sites
function sanitizeForDisplay(dirtyHtml) {
  return DOMPurify.sanitize(dirtyHtml, { ALLOWED_TAGS: ['b', 'i', 'em', 'strong'] })
}

module.exports = { sanitizeForDisplay }
