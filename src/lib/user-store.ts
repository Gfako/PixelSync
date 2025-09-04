// Simple in-memory user store for development
// In production, this would be a database

interface User {
  id: string
  email: string
  password: string // In production, this would be hashed
  name: string
}

// In-memory user storage
const users: User[] = []

export const createUser = (email: string, password: string, name: string): User => {
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    throw new Error('User already exists')
  }

  const user: User = {
    id: Math.random().toString(36).substring(2, 15),
    email,
    password, // In production, hash this with bcrypt
    name
  }

  users.push(user)
  return user
}

export const validateUser = (email: string, password: string): User | null => {
  const user = users.find(u => u.email === email && u.password === password)
  return user || null
}

export const findUserByEmail = (email: string): User | null => {
  return users.find(u => u.email === email) || null
}

// Add a default test user
createUser('test@example.com', 'password123', 'Test User')