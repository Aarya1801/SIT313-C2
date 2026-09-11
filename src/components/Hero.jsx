import TerminalCard from './TerminalCard'

function Hero() {
  return (
    <section className="hero" id="top">
      <div>
        <p className="kicker">SIT313 / TASK P3</p>
        <h1>Build, learn and stay connected.</h1>
        <p className="hero-copy">
          DEV@Deakin is a student-focused space for development ideas,
          practical tutorials and useful technology resources.
        </p>
      </div>
      <TerminalCard />
    </section>
  )
}

export default Hero
