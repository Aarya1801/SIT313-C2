import { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentUser } from '../services/userService'

const AuthContext = createContext(null)
const TOKEN_KEY = 'devDeakinToken'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (!token) return

    // Check a saved token on refresh before restoring the user details.
    getCurrentUser(token)
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        setToken(null)
        setUser(null)
      })
  }, [token])

  function login(nextToken, nextUser) {
    localStorage.setItem(TOKEN_KEY, nextToken)
    setToken(nextToken)
    setUser(nextUser)
  }

  function logout() {
    // Remove both the stored token and the in-memory session.
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
