function SubscribeSection() {
  function handleSubmit(event) {
    event.preventDefault()
    window.alert('Thanks for subscribing!')
    event.currentTarget.reset()
  }

  return (
    <section className="subscribe-section" id="subscribe">
      <p className="kicker">NEWSLETTER SIGN-UP</p>
      <h2>Join the DEV@Deakin community</h2>
      <p>Enter your email address to hear about new articles, tutorials and project ideas.</p>

      <form className="subscribe-form" onSubmit={handleSubmit}>
        <label className="visually-hidden" htmlFor="subscriber-email">Email address</label>
        <input
          type="email"
          id="subscriber-email"
          name="email"
          placeholder="Enter your email address"
          autoComplete="email"
          required
        />
        <button type="submit">Subscribe</button>
      </form>
    </section>
  )
}

export default SubscribeSection
