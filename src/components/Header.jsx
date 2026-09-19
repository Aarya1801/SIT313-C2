import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="site-header">
      <Link className="brand" to="/">
        <strong>DEV@Deakin</strong>
      </Link>

      <nav className="main-nav" aria-label="Main navigation">
        <label className="visually-hidden" htmlFor="site-search">Search</label>
        <input id="site-search" type="search" placeholder="Search..." />
        <Link to="/post">Post</Link>
        <Link to="/pricing">Pricing</Link>
        {user ? (
          <button type="button" onClick={logout}>Logout</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Register</Link>
          </>
        )}
      </nav>
    </header>
  )
}

export default Header
