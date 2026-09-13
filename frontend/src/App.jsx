import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Browse from './pages/Browse.jsx'
import Dashboard from './pages/Dashboard.jsx'
import SiteEditor from './pages/SiteEditor.jsx'
import Login from './pages/Login.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <div className="site-banner">
        <h1>FormCities</h1>
        <span className="tagline">the classroom is for cats too</span>
      </div>

      <div className="site-frame">
        <nav className="site-nav">
          <Link to="/">Home</Link>
          <Link to="/browse">Explore</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/login">Login</Link>
        </nav>

        <div className="zigzag-divider" />

        <div className="site-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/edit/:slug" element={<SiteEditor />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}
