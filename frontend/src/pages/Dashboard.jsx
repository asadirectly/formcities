import { useEffect, useState } from 'react'

const API = 'http://localhost:3000'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [checkedAuth, setCheckedAuth] = useState(false)
  const [mySites, setMySites] = useState([])
  const [files, setFiles] = useState(null)
  const [slug, setSlug] = useState('')
  const [pin, setPin] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    // credentials: include is what actually sends the session cookie cross port
    fetch(`${API}/api/users/me`, { credentials: 'include' })
      .then(res => (res.ok ? res.json() : null))
      .then(setUser)
      .finally(() => setCheckedAuth(true))
  }, [])

  useEffect(() => {
    if (!user) return
    fetch(`${API}/api/sites/mine`, { credentials: 'include' })
      .then(res => res.json())
      .then(setMySites)
  }, [user])

  async function handleUpload(e) {
    e.preventDefault()
    setStatus('charging digipogs and uploading...')

    const formData = new FormData()
    formData.append('slug', slug)
    formData.append('pin', pin)
    for (const file of files) {
      formData.append('files', file)
    }

    const res = await fetch(`${API}/api/sites/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    })

    const data = await res.json()
    setStatus(res.ok ? 'uploaded! hosting fee paid to the pool' : `error: ${data.error}`)
  }

  if (!checkedAuth) {
    return <div>checking login...</div>
  }

  if (!user) {
    return (
      <div>
        <p>you need to log in with formbar first</p>
        <a className="pill-button" href={`${API}/api/auth/login`}>Log in with Formbar</a>
      </div>
    )
  }

  return (
    <div>
      <h2>My Dashboard</h2>
      <p>logged in as <strong>{user.username}</strong></p>

      <p className="fee-notice">
        publishing or updating a site costs a digipog fee. you'll need your formbar pin to confirm it.
      </p>

      <h3>upload a site</h3>
      <form onSubmit={handleUpload}>
        <input className="form-field" placeholder="site slug (like my-site)" value={slug} onChange={e => setSlug(e.target.value)} />
        <input className="form-field" type="file" multiple onChange={e => setFiles(e.target.files)} />
        <input className="form-field" placeholder="formbar digipog pin" type="password" value={pin} onChange={e => setPin(e.target.value)} />
        <button className="pill-button" type="submit">Upload &amp; Pay Hosting Fee</button>
      </form>
      {status && <p>{status}</p>}

      <h3>my sites</h3>
      <ul>
        {mySites.map(site => <li key={site.slug}>{site.slug}</li>)}
      </ul>
    </div>
  )
}
