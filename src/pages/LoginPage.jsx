import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { verifyLoginCredentials } from '../services/userService'
import { loginSchema } from '../validation/authSchemas'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (isProcessing) {
      return
    }

    setStatus('')

    const validation = loginSchema.safeParse(formData)

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors

      setErrors(Object.fromEntries(
        Object.entries(fieldErrors).map(([field, messages]) => [field, messages[0]]),
      ))
      return
    }

    setErrors({})
    setIsProcessing(true)

    try {
      const result = await verifyLoginCredentials(
        validation.data.email,
        validation.data.password,
      )

      if (!result) {
        setStatus('Email or password is incorrect. Please try again or create a free account.')
        return
      }

      // Save the session before returning to the home page.
      login(result.token, result.user)
      navigate('/')
    } catch {
      setStatus('Unable to log in right now. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <section className="account-page">
      <div className="account-panel">
        <h1>Login</h1>

        <form className="account-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="login-email">Your email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'login-email-error' : undefined}
            />
            {errors.email && <p className="field-error" id="login-email-error">{errors.email}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="login-password">Your password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'login-password-error' : undefined}
            />
            {errors.password && <p className="field-error" id="login-password-error">{errors.password}</p>}
          </div>

          <button type="submit" disabled={isProcessing}>
            {isProcessing ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="form-status" aria-live="polite">{status}</p>
        <p className="account-switch">New to DEV@Deakin? <Link to="/signup">Sign up</Link></p>
      </div>
    </section>
  )
}

export default LoginPage
