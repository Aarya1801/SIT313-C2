const encoder = new TextEncoder()

function bytesToBase64(bytes) {
  return btoa(String.fromCharCode(...bytes))
}

function base64ToBytes(value) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0))
}

async function derivePassword(password, salt) {
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passwordKey,
    256,
  )

  return new Uint8Array(derivedBits)
}

export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const hash = await derivePassword(password, salt)

  return {
    passwordHash: bytesToBase64(hash),
    passwordSalt: bytesToBase64(salt),
  }
}

export async function verifyPassword(password, passwordSalt, expectedHash) {
  const salt = base64ToBytes(passwordSalt)
  const actualHash = await derivePassword(password, salt)
  const expectedBytes = base64ToBytes(expectedHash)

  if (actualHash.length !== expectedBytes.length) {
    return false
  }

  let difference = 0

  for (let index = 0; index < actualHash.length; index += 1) {
    difference |= actualHash[index] ^ expectedBytes[index]
  }

  return difference === 0
}
