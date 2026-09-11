function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-columns">
          <div className="footer-intro">
            <a className="brand" href="#top">
              <strong>DEV@Deakin</strong>
              <span>A student developer community</span>
            </a>
            <p>Learn, share and build alongside developers at Deakin.</p>
          </div>

          <div className="footer-column">
            <h2>Explore</h2>
            <ul className="footer-links">
              <li><a href="#articles">Articles</a></li>
              <li><a href="#tutorials">Tutorials</a></li>
              <li><a href="#subscribe">Newsletter</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h2>Support</h2>
            <ul className="footer-links">
              <li><a href="mailto:support@devdeakin.example">Contact us</a></li>
              <li><a href="#top">Help centre</a></li>
              <li><a href="#top">Community</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h2>Stay connected</h2>
            <ul className="social-links">
              <li>
                <a href="https://github.com/" aria-label="GitHub">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.82a9.6 9.6 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86V21c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" /></svg>
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.2 3.5A2.2 2.2 0 1 1 5.2 8a2.2 2.2 0 0 1 0-4.5ZM3.3 9.5h3.8V21H3.3V9.5Zm6.1 0H13v1.6h.05c.5-.95 1.7-2 3.5-2 3.75 0 4.45 2.47 4.45 5.68V21h-3.78v-5.51c0-1.32-.03-3.01-1.84-3.01-1.84 0-2.12 1.43-2.12 2.91V21H9.4V9.5Z" /></svg>
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/" aria-label="YouTube">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.58 7.19a2.73 2.73 0 0 0-1.92-1.93C17.96 4.8 12 4.8 12 4.8s-5.96 0-7.66.46a2.73 2.73 0 0 0-1.92 1.93A28.5 28.5 0 0 0 1.96 12c0 1.63.16 3.25.46 4.81a2.73 2.73 0 0 0 1.92 1.93c1.7.46 7.66.46 7.66.46s5.96 0 7.66-.46a2.73 2.73 0 0 0 1.92-1.93c.3-1.56.46-3.18.46-4.81s-.16-3.25-.46-4.81ZM10 15.09V8.91L15.2 12 10 15.09Z" /></svg>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Aarya Patel · DEV@Deakin</p>
          <ul className="legal-links">
            <li><a href="#top">Privacy Policy</a></li>
            <li><a href="#top">Terms</a></li>
            <li><a href="#top">Code of Conduct</a></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer
