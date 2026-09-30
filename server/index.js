import 'dotenv/config'
import crypto from 'node:crypto'
import cors from 'cors'
import express from 'express'
import jwt from 'jsonwebtoken'
import { initializeApp } from 'firebase/app'
import { doc, getDoc, getFirestore, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { z } from 'zod'
import { createNewsletterRouter, handleMalformedJson } from './routes/newsletter.js'

const firebaseApp = initializeApp({
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
})
const db = getFirestore(firebaseApp)
const app = express()
const port = process.env.PORT || 3001
const jwtSecret = process.env.JWT_SECRET || 'dev-deakin-local-secret'

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())
app.use(handleMalformedJson)
app.use('/api', createNewsletterRouter())

const passwordSchema = z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/)
const registrationSchema = z.object({
  fullName: z.string().trim().min(3),
  email: z.string().trim().email(),
  password: passwordSchema,
})
const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
})

function userIdForEmail(email) {
  return crypto.createHash('sha256').update(email).digest('hex')
}

function hashPassword(password, salt = crypto.randomBytes(16)) {
  return {
    passwordHash: crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256').toString('base64'),
    passwordSalt: salt.toString('base64'),
  }
}

function verifyPassword(password, salt, expectedHash) {
  const actual = crypto.pbkdf2Sync(password, Buffer.from(salt, 'base64'), 100000, 32, 'sha256')
  const expected = Buffer.from(expectedHash, 'base64')
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected)
}

// Only send the fields the frontend needs for the active session.
function publicUser(id, data) {
  return {
    id,
    fullName: data.fullName,
    email: data.email,
    plan: data.plan === 'paid' ? 'paid' : 'free',
  }
}

function authenticate(req, res, next) {
  // Protected routes expect the JWT in the standard Authorization header.
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '')
  if (!token) return res.status(401).json({ message: 'Authentication required.' })

  try {
    req.auth = jwt.verify(token, jwtSecret)
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired session.' })
  }
}

app.post('/api/auth/register', async (req, res, next) => {
  try {
    const validation = registrationSchema.safeParse(req.body)
    if (!validation.success) return res.status(400).json({ message: 'Invalid registration details.' })

    const { fullName, password } = validation.data
    const email = validation.data.email.toLowerCase()
    const id = userIdForEmail(email)
    const reference = doc(db, 'users', id)
    if ((await getDoc(reference)).exists()) return res.status(409).json({ message: 'Email already registered.' })

    await setDoc(reference, {
      fullName: fullName.trim(),
      email,
      ...hashPassword(password),
      plan: 'free',
      createdAt: serverTimestamp(),
    })
    res.status(201).json({ success: true })
  } catch (error) {
    next(error)
  }
})

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const validation = loginSchema.safeParse(req.body)
    if (!validation.success) return res.status(400).json({ message: 'Invalid login details.' })

    const email = validation.data.email.toLowerCase()
    const id = userIdForEmail(email)
    const snapshot = await getDoc(doc(db, 'users', id))
    if (!snapshot.exists()) return res.status(401).json({ message: 'Email or password is incorrect.' })

    const user = snapshot.data()
    if (!verifyPassword(validation.data.password, user.passwordSalt, user.passwordHash)) {
      return res.status(401).json({ message: 'Email or password is incorrect.' })
    }

    const token = jwt.sign({ userId: id }, jwtSecret, { expiresIn: '24h' })
    res.json({ token, user: publicUser(id, user) })
  } catch (error) {
    next(error)
  }
})

app.get('/api/auth/me', authenticate, async (req, res, next) => {
  try {
    const snapshot = await getDoc(doc(db, 'users', req.auth.userId))
    if (!snapshot.exists()) return res.status(404).json({ message: 'User not found.' })
    res.json({ user: publicUser(snapshot.id, snapshot.data()) })
  } catch (error) {
    next(error)
  }
})

app.patch('/api/users/plan', authenticate, async (req, res, next) => {
  try {
    if (req.body.plan !== 'paid') return res.status(400).json({ message: 'Invalid plan.' })
    const reference = doc(db, 'users', req.auth.userId)
    const snapshot = await getDoc(reference)
    if (!snapshot.exists()) return res.status(404).json({ message: 'User not found.' })

    // Payment fields never reach this route; Firestore only receives the plan.
    await updateDoc(reference, { plan: 'paid' })
    res.json({ user: publicUser(snapshot.id, { ...snapshot.data(), plan: 'paid' }) })
  } catch (error) {
    next(error)
  }
})

app.use((error, req, res, next) => {
  console.error(error)
  res.status(500).json({ message: 'Server error. Please try again.' })
})

app.listen(port, () => console.log(`API running on http://localhost:${port}`))
