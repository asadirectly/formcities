export default function Home() {
  return (
    <div>
      <h2>Welcome To FormCities!</h2>

      <p>
        FormCities is a free site hosting service for our class, initially created by a Sophomore during the 2026-2027 school year.
      </p>

      <p>
        Logins run through <strong>Formbar</strong>, so you don't need a separate
        account here. Publishing or updating a site costs a small number of{' '}
        <strong>digipogs</strong>, which get paid into the class hosting pool
        instead of to any one person. Think of it like chipping in for server
        space, but with pogs.
      </p>

      <ul>
        <li>Upload your own html/css/js and get a subdomain like yourname.formcitiesdomain</li>
        <li>Browse everyone else's sites on the Explore page</li>
        <li>Your JS runs isolated from everyone else's site, on its own origin</li>
        <li>The classroom is for cats too.</li>
        <li>unfortunately, the cats do not know what a server is.</li>
        <li>they are still very good at operating one.</li>
      </ul>

      <p className="fee-notice">
        Publishing costs a few digipogs. Head to the
        Dashboard to log in with Formbar and upload your first site.
      </p>
    </div>
  )
}
