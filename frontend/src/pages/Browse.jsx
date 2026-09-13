import { useEffect, useState } from 'react'

export default function Browse() {
  const [sites, setSites] = useState([])

  useEffect(() => {
    fetch('http://localhost:3000/api/sites')
      .then(res => res.json())
      .then(setSites)
      .catch(() => setSites([]))
  }, [])

  return (
    <div>
      <h2>Explore Student Sites</h2>

      {sites.length === 0 && <p>no sites published yet, be the first one up</p>}

      <div className="card-grid">
        {sites.map(site => (
          <div key={site.slug} className="card-box">
            <strong>{site.title || site.slug}</strong>
            <p style={{ fontSize: '0.85rem', margin: '0.5rem 0' }}>by {site.owner_username}</p>
            {/* subdomain style url, this is what actually keeps their site isolated */}
            <a href={`http://${site.slug}.localhost:8080/`} target="_blank" rel="noreferrer">
              visit site &rarr;
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
