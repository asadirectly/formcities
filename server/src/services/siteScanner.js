// this is just a first pass filter, not a real sandbox
// real protection comes from serving sites on isolated origins with a strict CSP
// see infra/nginx/site-sandbox.conf for the actual boundary

// stuff that's a red flag in student JS, could be trying to break out of the sandbox
// or hit endpoints it shouldn't
const suspiciousPatterns = [
  /document\.domain\s*=/i,       // trying to mess with same-origin rules
  /top\.location/i,               // trying to bust out of an iframe
  /window\.parent/i,               // same idea, reaching for the parent frame
  /eval\s*\(/i,                    // eval is banned, too easy to hide stuff in it
  /new\s+Function\s*\(/i,          // same deal as eval basically
  /<script[^>]*src\s*=\s*["']?(?!https:\/\/)/i // inline script tags pulling from weird sources
]

function scanJsFile(content) {
  const problems = []
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(content)) {
      problems.push(`matched suspicious pattern: ${pattern}`)
    }
  }
  return problems
}

function scanUpload(files) {
  const allProblems = []
  for (const file of files) {
    if (file.originalname.endsWith('.js')) {
      const text = file.buffer.toString('utf8')
      const problems = scanJsFile(text)
      if (problems.length > 0) {
        allProblems.push({ file: file.originalname, problems })
      }
    }
  }
  return allProblems
}

// TODO: this regex approach is easy to get around with obfuscation
// if this becomes a real concern, look at running uploads through
// something like eslint with a locked down config instead
module.exports = { scanUpload, scanJsFile }
