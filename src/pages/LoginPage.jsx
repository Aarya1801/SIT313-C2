import { Link } from 'react-router-dom'

function LoginPage() {
  return (
    <section>
      <h1>Login</h1>
      <Link to="/signup">Sign up</Link>
    </section>
  )
}

export default LoginPage
