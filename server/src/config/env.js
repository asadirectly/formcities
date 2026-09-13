// this just centralizes reading env vars so we don't have process.env scattered everywhere
require('dotenv').config()

module.exports = {
  port: process.env.PORT || 3000,
  dbPath: process.env.DB_PATH || './data/app.db',
  sitesDir: process.env.SITES_DIR || '../sites-storage',
  maxSiteSizeBytes: 15 * 1024 * 1024, // 15mb per student site, adjust if needed
  maxTotalStudentBytes: 64 * 1024 * 1024, // total quota across all their uploads (35)

  // locally this is "localhost" so alice.localhost:8080 works out of the box
  // in production set this to something like "sites.yourschool.edu"
  baseDomain: process.env.BASE_DOMAIN || 'localhost',

  // session cookie signing secret, this is ours, separate from formbar's own tokens
  sessionSecret: process.env.SESSION_SECRET || 'change-me-before-deploying',

  // formbar connection, see the formbar.js wiki for what these mean
  // FORMBAR_API_URL: the backend api server (this is what we call for /api/v1/... stuff)
  // FORMBAR_CLIENT_URL: the frontend login page we redirect students to
  // THIS_URL: our own public url, formbar redirects back here after login
  formbarApiUrl: process.env.FORMBAR_API_URL || 'http://localhost:420',
  formbarClientUrl: process.env.FORMBAR_CLIENT_URL || 'http://localhost:5173',
  thisUrl: process.env.THIS_URL || 'http://localhost:3000',

  // our own frontend (the vite dev server), where we send students after login
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5174',

  // this is the formbar POOL that gets paid instead of a specific person
  // create the pool first through formbar (POST /api/v1/pools/create) and put its id here
  payPoolId: process.env.PAY_POOL_ID || null,
  hostingFeeDigipogs: parseInt(process.env.HOSTING_FEE || '10', 10)
}
