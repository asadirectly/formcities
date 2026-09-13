import { useParams } from 'react-router-dom'

// this is just a placeholder for now, main upload flow lives in Dashboard.jsx
// could turn this into an actual in-browser code editor later (thinkin monaco or codemirror)
// but a simple file upload form covers the basic needs for now
export default function SiteEditor() {
  const { slug } = useParams()

  return (
    <div style={{ padding: '2rem' }}>
      <h2>editing {slug}</h2>
      <p>TODO: build an actual in browser editor here, for now use the upload form on the dashboard</p>
    </div>
  )
}
