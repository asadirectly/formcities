const express = require('express')
const router = express.Router()
const config = require('../config/env')
const formbar = require('../services/formbarClient')

// kicks off the login, sends the browser to formbar's login page
// this mirrors the minimal example on the formbar wiki
router.get('/login', (req, res) => {
  const callbackUrl = `${config.thisUrl}/api/auth/login/callback`
  const loginUrl = new URL('/oauth', config.formbarClientUrl)
  loginUrl.searchParams.set('redirectURL', callbackUrl)
  res.redirect(loginUrl.toString())
})

// formbar sends the browser back here with a token after the student logs in
router.get('/login/callback', async (req, res) => {
  const token = req.query.token
  if (!token) {
    return res.status(400).send('missing formbar token, login must have failed or been cancelled')
  }

  const me = await formbar.getMe(token)
  if (!me) {
    return res.status(401).send('formbar rejected that token')
  }

  // stash what we need in the session, not the raw token everywhere
  req.session.formbarUser = {
    id: me.id,
    username: me.username,
    // TODO: double check the actual field name formbar uses for role/permission level
    // once you're testing against a real instance, this is a guess based on the wiki
    role: me.role || me.permission || 'student'
  }
  req.session.formbarToken = token

  // back to the frontend, dashboard is a reasonable landing spot after login
  res.redirect(`${config.frontendUrl}/dashboard`)
})

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true })
  })
})

module.exports = router
