function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top">
        <strong>DEV@Deakin</strong>
        <span>Aarya Patel</span>
      </a>

      <nav className="main-nav" aria-label="Main navigation">
        <a href="#top">Home</a>
        <a href="#articles">Articles</a>
        <a href="#tutorials">Tutorials</a>
        <a href="#subscribe">Newsletter</a>
      </nav>
    </header>
  )
}

export default Header
