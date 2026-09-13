// this replaces the old jwt based auth.middleware.js
// login now happens through formbar, so "logged in" just means the session
// has a formbarUser on it (see routes/formbar.routes.js for how that gets set)

function requireAuth(req, res, next) {
  if (!req.session.formbarUser) {
    return res.status(401).json({ error: 'not logged in, go through /api/auth/login first' })
  }
  req.user = req.session.formbarUser
  next()
}

// TODO: this checks a role field we're guessing the name of, see the note in
// formbar.routes.js. confirm the real field against a live formbar instance
// and swap this check to match before actually relying on it for grading/moderation
function requireAdmin(req, res, next) {
  if (!req.user || (req.user.role !== 'teacher' && req.user.role !== 'manager')) {
    return res.status(403).json({ error: 'teachers/managers only' })
  }
  next()
}

module.exports = { requireAuth, requireAdmin }
