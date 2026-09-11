import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="site-header">
      <Link className="brand" to="/">
        <strong>DEV@Deakin</strong>
      </Link>

      <nav className="main-nav" aria-label="Main navigation">
        <label className="visually-hidden" htmlFor="site-search">Search</label>
        <input id="site-search" type="search" placeholder="Search..." />
        <Link to="/post">Post</Link>
        <Link to="/login">Login</Link>
      </nav>
    </header>
  )
}

export default Header
