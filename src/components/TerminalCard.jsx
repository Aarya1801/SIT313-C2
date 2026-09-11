function TerminalCard() {
  return (
    <div className="terminal-card" aria-label="Decorative terminal preview">
      <div className="terminal-bar" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="terminal-content">
        <p><span className="accent">aarya@dev</span>:~$ npm run dev</p>
        <p>DEV@Deakin is ready on localhost</p>
        <p><span className="accent">REACT</span> Components loaded</p>
        <p>Explore. Learn. Build something great.</p>
      </div>
    </div>
  )
}

export default TerminalCard
