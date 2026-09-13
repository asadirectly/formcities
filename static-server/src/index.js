const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = process.env.STATIC_PORT || 8080
const sitesRoot = path.resolve(__dirname, '../../sites-storage')

// locally this is "localhost" so alice.localhost:8080 just works, most browsers resolve *.localhost to 127.0.0.1 on their own
// in production point this at whatever domain you're hosting student sites under
const baseDomain = process.env.BASE_DOMAIN || 'localhost'
// IMPORTANT PLEASE READ THIS: this server should run on a completely different origin than the main app
// that separation is what actually keeps one student's js from touching another
// student's stuff or your even YOUR main app's cookies/session

app.use((req, res, next) => {
  // locks down what a student's page can do even if their js is running
  // no access to your main app's api, no cookies leaking anywhere, etc
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'none'; frame-ancestors 'self'"
  )
  res.setHeader('X-Content-Type-Options', 'nosniff')
  // stops a student site from being framed anywhere except your platform's own viewer page
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')
  next()
})

// pulls the student slug out of something like "alice.localhost" -> "alice"
// returns null if the request isn't using a subdomain at all (just "localhost")
function getSlugFromHost(hostname) {
  if (hostname === baseDomain) return null
  if (!hostname.endsWith('.' + baseDomain)) return null

  const slug = hostname.slice(0, hostname.length - baseDomain.length - 1)
  if (slug.includes('.')) return null // only handling one level of subdomain for now

  return slug
}

// shared by both the subdomain route and the path based fallback route below
function serveSiteFile(slug, reqPath, res) {
  // reject anything sketchy right away, don't even star resolving the path
  if (!slug || slug.includes('..') || reqPath.includes('..')) {
    return res.status(400).send('nope')
  }

  const cleanPath = reqPath === '/' ? '/index.html' : reqPath
  const siteDir = path.join(sitesRoot, slug)
  const filePath = path.join(siteDir, cleanPath)

  // double check the resolved path didn't escape the site's own folder
  if (!filePath.startsWith(siteDir)) {
    return res.status(400).send('nope')
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('not found')
  }

  res.sendFile(filePath)
}

app.use((req, res, next) => {
  const slug = getSlugFromHost(req.hostname)
  if (!slug) return next() // no subdomain, fall through to the path based routes below
  serveSiteFile(slug, req.path, res)
})

// e.g. http://localhost:8080/sites/alice/
app.get('/sites/:slug/*', (req, res) => {
  serveSiteFile(req.params.slug, '/' + req.params[0], res)
})

app.get('/sites/:slug', (req, res) => {
  res.redirect(`/sites/${req.params.slug}/index.html`)
})

app.listen(PORT, () => {
  console.log(`static site server running on http://localhost:${PORT}`)
  console.log(`try a student site at http://<slug>.${baseDomain}:${PORT}/`)
})
