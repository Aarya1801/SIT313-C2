import { useState } from 'react'
import { subscribeToNewsletter } from '../services/newsletterService'

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function SubscribeSection() {
  const [email, setEmail] = useState('')
  const [feedback, setFeedback] = useState({ message: '', type: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    setEmail(event.target.value)
    setFeedback({ message: '', type: '' })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (isSubmitting) return

    const normalizedEmail = email.trim().toLowerCase()

    if (!isValidEmail(normalizedEmail)) {
      setFeedback({ message: 'Please enter a valid email address.', type: 'error' })
      return
    }

    setIsSubmitting(true)
    setFeedback({ message: 'Submitting your email address...', type: '' })

    try {
      const result = await subscribeToNewsletter(normalizedEmail)
      setEmail('')
      setFeedback({ message: result.message, type: 'success' })
    } catch (error) {
      setFeedback({
        message: error.message || 'The subscription could not be completed. Please try again.',
        type: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="subscribe-section" id="subscribe">
      <p className="kicker">NEWSLETTER SIGN-UP</p>
      <h2>Join the DEV@Deakin community</h2>
      <p>Enter your email address to hear about new articles, tutorials and project ideas.</p>

      <form className="subscribe-form" onSubmit={handleSubmit} noValidate>
        <label className="visually-hidden" htmlFor="subscriber-email">Email address</label>
        <input
          type="email"
          id="subscriber-email"
          name="email"
          placeholder="Enter your email address"
          autoComplete="email"
          value={email}
          onChange={handleChange}
          disabled={isSubmitting}
          aria-invalid={feedback.type === 'error'}
          aria-describedby="subscribe-feedback"
          required
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Subscribing…' : 'Subscribe'}
        </button>
      </form>
      <p
        className={`subscribe-feedback ${feedback.type}`}
        id="subscribe-feedback"
        role={feedback.type === 'error' ? 'alert' : 'status'}
        aria-live="polite"
      >
        {feedback.message}
      </p>
    </section>
  )
}

export default SubscribeSection
