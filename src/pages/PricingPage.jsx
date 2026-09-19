import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { upgradePlan } from '../services/userService'

const initialPayment = { cardholder: '', cardNumber: '', expiry: '', cvv: '' }

function validatePayment(values) {
  // These checks are only for the demo form; card details stay in component state.
  const errors = {}
  if (values.cardholder.trim().length < 2) errors.cardholder = 'Enter the cardholder name.'
  if (!/^\d{16}$/.test(values.cardNumber.replace(/\s/g, ''))) errors.cardNumber = 'Enter a 16-digit card number.'
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(values.expiry)) errors.expiry = 'Use MM/YY format.'
  if (!/^\d{3,4}$/.test(values.cvv)) errors.cvv = 'Enter a 3 or 4-digit CVV.'
  return errors
}

function PricingPage() {
  const { token, user, setUser } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [payment, setPayment] = useState(initialPayment)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const isPaid = user?.plan === 'paid'

  function openUpgrade() {
    if (!user) {
      setStatus('Please log in to upgrade your plan.')
      return
    }
    if (!isPaid) setIsModalOpen(true)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const validationErrors = validatePayment(payment)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length) return

    setIsProcessing(true)
    try {
      // The upgrade request sends the plan only, never the payment form values.
      const { user: updatedUser } = await upgradePlan(token)
      setUser(updatedUser)
      setPayment(initialPayment)
      setIsModalOpen(false)
      setStatus('Your account is now on the Paid Plan.')
    } catch {
      setStatus('Unable to upgrade right now. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <section className="pricing-page">
      <div className="pricing-heading">
        <p className="kicker">SUBSCRIPTIONS</p>
        <h1>Choose your plan</h1>
        <p>{user ? `Current subscription: ${isPaid ? 'Paid Plan' : 'Free Plan'}` : 'Log in to upgrade your account.'}</p>
      </div>

      <div className="pricing-grid">
        <article className={`plan-card ${!isPaid && user ? 'current-plan' : ''}`}>
          <p className="card-type">FREE</p>
          <h2>Free Plan</h2>
          <ul>
            <li>Standard DEV@Deakin access</li>
            <li>Limited posts</li>
            <li>Standard image uploads</li>
            <li>Community features</li>
          </ul>
        </article>

        <article className={`plan-card ${isPaid ? 'current-plan' : ''}`}>
          <p className="card-type">PAID</p>
          <h2>Paid Plan</h2>
          <ul>
            <li>Everything in Free</li>
            <li>Early access to premium posts</li>
            <li>Increased monthly posts</li>
            <li>Larger image uploads</li>
            <li>Premium profile features</li>
          </ul>
          <button className="upgrade-button" type="button" onClick={openUpgrade} disabled={isPaid}>
            {isPaid ? 'Paid Plan Active' : 'Upgrade Plan'}
          </button>
        </article>
      </div>

      <p className="pricing-status" aria-live="polite">
        {status} {!user && status && <Link to="/login">Login</Link>}
      </p>

      {isModalOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setIsModalOpen(false)}>
          <div className="payment-modal" role="dialog" aria-modal="true" aria-labelledby="payment-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" aria-label="Close" onClick={() => setIsModalOpen(false)}>×</button>
            <h2 id="payment-title">Upgrade to Paid</h2>
            <p>Demo only — payment details are validated in your browser and are never saved.</p>
            <form className="account-form" onSubmit={handleSubmit} noValidate>
              {[
                ['cardholder', 'Cardholder name', 'text', 'name'],
                ['cardNumber', 'Card number', 'text', 'cc-number'],
                ['expiry', 'Expiry', 'text', 'cc-exp'],
                ['cvv', 'CVV', 'password', 'cc-csc'],
              ].map(([name, label, type, autoComplete]) => (
                <div className="form-field" key={name}>
                  <label htmlFor={`payment-${name}`}>{label}</label>
                  <input id={`payment-${name}`} name={name} type={type} autoComplete={autoComplete} value={payment[name]} placeholder={name === 'expiry' ? 'MM/YY' : undefined} onChange={(event) => setPayment((current) => ({ ...current, [name]: event.target.value }))} aria-invalid={Boolean(errors[name])} />
                  {errors[name] && <p className="field-error">{errors[name]}</p>}
                </div>
              ))}
              <button type="submit" disabled={isProcessing}>{isProcessing ? 'Upgrading...' : 'Confirm Upgrade'}</button>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default PricingPage
