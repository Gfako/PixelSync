// Simple in-memory user store for development
// In production, this would be a database

import bcrypt from 'bcryptjs'

interface User {
  id: string
  email: string
  password: string // Hashed with bcrypt
  name: string
}

// In-memory user storage
const users: User[] = []

export const createUser = async (email: string, password: string, name: string): Promise<User> => {
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    throw new Error('User already exists')
  }

  // Hash password with bcrypt
  const hashedPassword = await bcrypt.hash(password, 12)

  const user: User = {
    id: Math.random().toString(36).substring(2, 15),
    email,
    password: hashedPassword,
    name
  }

  users.push(user)
  return user
}

export const validateUser = async (email: string, password: string): Promise<User | null> => {
  const user = users.find(u => u.email === email)
  if (!user) {
    return null
  }

  // Validate password using bcrypt
  const isValid = await bcrypt.compare(password, user.password)
  return isValid ? user : null
}

export const findUserByEmail = (email: string): User | null => {
  return users.find(u => u.email === email) || null
}

// Initialize with a test user for development (remove in production)
if (process.env.NODE_ENV === 'development') {
  createUser('test@example.com', 'password123', 'Test User').catch(console.error)
}