# FormCities

A nekoweb style site hosting platform for Formbar. Students upload
and host their own personal sites, browse everyone else's, and write their own
HTML/CSS/JS. Accounts and payments run through Formbar.

## how it's set up:

Three parts:

- `server/` - this is the main app. It handles the formbar login flow, uploads, digipog
  charges, the database, admin stuff.
- `static-server/` - just serves the student site files, nothing else. Runs on
  its own port and subdomain so the student JS never shares an origin with the
  main app for security purposes.
- `frontend/` - the (React) site itself (login, browse, dashboard).

Server/static-server separation is the main security boundary. If a
student's JS somehow got malicious, it should only ever be able to mess with
their own page, not touch your database or steal another student's login.

## Accounts

There is no local account setup, the login goes through Formbar's oauth style
redirect flow (see the [Formbar Passport wiki page](https://github.com/csmith1188/Formbar.js/wiki/Formbar-Passport-(Oauth-Login))):

1. Student clicks "log in with formbar" on our frontend
2. Backend redirects them to formbar login page
3. Formbar redirects back to our backend with a token
4. Backend calls formbar's `/api/v1/user/me` to check who that is, then stashes it
   in a session cookie

This doesn't store passwords, ever. It just remembers which formbar user id/username
owns which site.

## Digipogs and the hosting pool

Publishing or updating a site costs a small digipog fee (`HOSTING_FEE` in
`.env`, defaults to 150). That fee gets paid into a formbar **pool** because uh I wanna track my moniez better than just a user account.

But if you're trying to be the one getting paid need to:

1. Create a pool in formbar: `POST /api/v1/pools/create` (see the
   [Digipogs wiki page](https://github.com/csmith1188/Formbar.js/wiki/Digipogs))
2. Put that pool's id in `server/.env` as `PAY_POOL_ID`

Students pay with their own formbar digipog pin, which is typed into the upload form.
The transfer happens server side through `/api/v1/digipogs/transfer` with a
typed pool recipient (`{ id: PAY_POOL_ID, type: "pool" }`).

## Running it locally

You'll need a running Formbar instance too (see
[Hosting Formbar.js Locally](https://github.com/csmith1188/Formbar.js/wiki/Hosting-Formbar.js-Locally)),
or point `FORMBAR_API_URL`/`FORMBAR_CLIENT_URL` at an existing one your class uses.

```
cd server && npm install && cp .env.example .env && npm run dev
cd static-server && npm install && npm start
cd frontend && npm install && npm run dev
```

Main app: http://localhost:3000
Frontend: http://localhost:5174 (one port over from formbar's own frontend, so that they don't collide but idk if somethings changing that)
Student sites: http://alice.localhost:8080/ (swap "alice" for the actual slug / site name)

Most browsers resolve *.localhost to 127.0.0.1 on their own, so subdomains
just work without touching /etc/hosts. If that doesn't work for you (typically some
Windows setups), run `infra/scripts/setup-subdomain.sh <slug>` to add a hosts
entry manually. The old path style (localhost:8080/sites/:slug/) still works
too, it's just not the isolated version (so don't use it).

For a real deployment, point infra/nginx/site-sandbox.conf at a wildcard DNS
record like `*.sites.yourschool.edu` and set BASE_DOMAIN in the static server's
env to match.

## look and feel

style based on nekoweb.org, I drew a tiled background (see `frontend/public/tiles.png`),
there are pill nav buttons, and the site has creamy colors. You the tile image for a new
texture any time, it just needs to actually tile (background-size is set to
64px in `index.css`, adjust if you make a differently sized tile). There is also a banner to swap.
Frontend contains most cosmetic files.

## Notes / things still to do

- siteScanner.js is just regex pattern matching right now, easy to get around
  with obfuscated code. Should be fine for a classroom tool, would need something
  stronger for outside use.
- the admin role check in formbarAuth.middleware.js is guessing at the field
  name formbar uses for role/permission level, confirm against a real
  `/api/v1/user/me` response before relying on it.
- no real content moderation beyond the admin unpublish endpoint.
- make a code-editor
- potentially make js library
