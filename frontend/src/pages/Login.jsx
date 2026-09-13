export default function Login() {
  // there's no form here on purpose, formbar handles the actual login
  // clicking this just bounces the browser to formbar and back
  return (
    <div>
      <h2>Login</h2>
      <p>FormCities accounts are just Formbar accounts, log in with the same one you use in class.</p>
      <a className="pill-button" href="http://localhost:3000/api/auth/login">
        Log in with Formbar
      </a>
    </div>
  )
}
