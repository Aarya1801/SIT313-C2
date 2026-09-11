import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../services/userService'
import { registrationSchema } from '../validation/authSchemas'

const initialForm = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
}

function SignUpPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialForm)
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

    const validation = registrationSchema.safeParse(formData)

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
      const result = await registerUser(validation.data)

      if (!result.success && result.reason === 'duplicate-email') {
        setErrors({ email: 'An account with this email already exists.' })
        return
      }

      navigate('/login')
    } catch {
      setStatus('Unable to create your account right now. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <section className="account-page">
      <div className="account-panel">
        <h1>Create a DEV@Deakin Account</h1>

        <form className="account-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="signup-name">Name*</label>
            <input
              id="signup-name"
              name="fullName"
              type="text"
              autoComplete="name"
              value={formData.fullName}
              onChange={handleChange}
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? 'signup-name-error' : undefined}
            />
            {errors.fullName && <p className="field-error" id="signup-name-error">{errors.fullName}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="signup-email">Email*</label>
            <input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'signup-email-error' : undefined}
            />
            {errors.email && <p className="field-error" id="signup-email-error">{errors.email}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="signup-password">Password*</label>
            <input
              id="signup-password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'signup-password-error' : undefined}
            />
            {errors.password && <p className="field-error" id="signup-password-error">{errors.password}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="signup-confirm-password">Confirm password*</label>
            <input
              id="signup-confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={errors.confirmPassword ? 'signup-confirm-password-error' : undefined}
            />
            {errors.confirmPassword && (
              <p className="field-error" id="signup-confirm-password-error">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button type="submit" disabled={isProcessing}>
            {isProcessing ? 'Creating...' : 'Create'}
          </button>
        </form>

        <p className="form-status" aria-live="polite">{status}</p>
      </div>
    </section>
  )
}

export default SignUpPage
