import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import db from '../firebase'
import { hashPassword, verifyPassword } from '../utils/password'

const encoder = new TextEncoder()

function normalizeEmail(email) {
  return email.trim().toLowerCase()
}

async function getEmailDocumentKey(email) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(email))

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

async function getUserReference(email) {
  const normalizedEmail = normalizeEmail(email)
  const documentKey = await getEmailDocumentKey(normalizedEmail)

  return {
    normalizedEmail,
    reference: doc(db, 'users', documentKey),
  }
}

export async function userExists(email) {
  const { reference } = await getUserReference(email)
  const snapshot = await getDoc(reference)

  return snapshot.exists()
}

export async function registerUser({ fullName, email, password }) {
  const { normalizedEmail, reference } = await getUserReference(email)
  const existingUser = await getDoc(reference)

  if (existingUser.exists()) {
    return { success: false, reason: 'duplicate-email' }
  }

  const { passwordHash, passwordSalt } = await hashPassword(password)

  await setDoc(reference, {
    fullName: fullName.trim(),
    email: normalizedEmail,
    passwordHash,
    passwordSalt,
    createdAt: serverTimestamp(),
  })

  return { success: true }
}

export async function verifyLoginCredentials(email, password) {
  const { reference } = await getUserReference(email)
  const snapshot = await getDoc(reference)

  if (!snapshot.exists()) {
    return false
  }

  const user = snapshot.data()

  return verifyPassword(password, user.passwordSalt, user.passwordHash)
}
