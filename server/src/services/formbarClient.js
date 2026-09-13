const config = require('../config/env')

// just a thin wrapper around formbar's http api, keeps the fetch calls in one spot
// see: https://github.com/csmith1188/Formbar.js/wiki/HTTP-API
// and: https://github.com/csmith1188/Formbar.js/wiki/Digipogs

// looks up whoever this token belongs to, we use this right after the oauth redirect
// and any time we need to double check who's logged in
async function getMe(token) {
  const res = await fetch(`${config.formbarApiUrl}/api/v1/user/me`, {
    headers: { Authorization: `Bearer ${token}` }
  })

  if (!res.ok) {
    return null
  }

  const body = await res.json()
  return body.data
}

// charges a student's digipogs into our hosting pool instead of a specific person
// needs the student's own pin, formbar requires that as a lightweight confirmation step
async function chargeHostingFee(studentFormbarId, pin, reason) {
  if (!config.payPoolId) {
    throw new Error('PAY_POOL_ID is not set, create a pool in formbar first and add its id to .env')
  }

  const res = await fetch(`${config.formbarApiUrl}/api/v1/digipogs/transfer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: studentFormbarId,
      to: { id: Number(config.payPoolId), type: 'pool' },
      amount: config.hostingFeeDigipogs,
      reason: reason || 'FormCities hosting fee',
      pin
    })
  })

  const body = await res.json()
  // formbar wraps the real result in body.data, see the digipogs wiki page for the shape
  const result = body.data || body
  return result // { success: true/false, message: "..." }
}

module.exports = { getMe, chargeHostingFee }
