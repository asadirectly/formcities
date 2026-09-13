const express = require('express')
const session = require('express-session')
const config = require('./config/env')

const formbarRoutes = require('./routes/formbar.routes')
const sitesRoutes = require('./routes/sites.routes')
const usersRoutes = require('./routes/users.routes')
const adminRoutes = require('./routes/admin.routes')

const app = express()
app.use(express.json())

// needed so the session cookie survives the redirect out to formbar and back
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true } // secure: true too once this is actually running on https
}))

// frontend is on a different port than this server, so we need actual cors,
// and it has to be a specific origin (not *) becayse we're sending cookies
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', config.frontendUrl)
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE')
  next()
})

app.use('/api/auth', formbarRoutes)
app.use('/api/sites', sitesRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/admin', adminRoutes)

app.get('/api/health', (req, res) => res.json({ ok: true }))

// catch multer errors (file too big, bad type, etc) so they come back as clean json
app.use((err, req, res, next) => {
  console.error(err.message)
  res.status(400).json({ error: err.message })
})

app.listen(config.port, () => {
  console.log(`server running on http://localhost:${config.port}`)
})
