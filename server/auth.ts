import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from './db';
import { users, type InsertUser, type User } from '@shared/schema';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'vita-secret-key-2025';
const JWT_EXPIRES_IN = '7d';

export interface AuthUser {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  displayName: string;
  role: string;
  votes: number;
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser;
  } catch (error) {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function registerUser(userData: InsertUser): Promise<{ user: AuthUser; token: string }> {
  // Check if user already exists
  const existingUser = await db.select()
    .from(users)
    .where(eq(users.email, userData.email))
    .limit(1);

  if (existingUser.length > 0) {
    throw new Error('User with this email already exists');
  }

  // Check if username is already taken
  const existingUsername = await db.select()
    .from(users)
    .where(eq(users.username, userData.username))
    .limit(1);

  if (existingUsername.length > 0) {
    throw new Error('Username is already taken');
  }

  // Hash password
  const hashedPassword = await hashPassword(userData.password);

  // Set voting weight based on role
  let votes = 1;
  if (userData.role === 'lead_trader') votes = 2;
  if (userData.role === 'senior_trader') votes = 1;

  // Insert user into database
  const [newUser] = await db.insert(users).values({
    ...userData,
    name: userData.displayName, // Legacy name field for compatibility
    password: hashedPassword,
    votes,
  }).returning();

  const authUser: AuthUser = {
    id: newUser.id,
    email: newUser.email,
    username: newUser.username,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    displayName: newUser.displayName,
    role: newUser.role,
    votes: newUser.votes,
  };

  const token = generateToken(authUser);

  return { user: authUser, token };
}

export async function loginUser(email: string, password: string): Promise<{ user: AuthUser; token: string }> {
  // Find user by email
  const [user] = await db.select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);

  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    throw new Error('Account is deactivated');
  }

  // Check password
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Update last login
  await db.update(users)
    .set({ lastLogin: new Date() })
    .where(eq(users.id, user.id));

  const authUser: AuthUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    displayName: user.displayName,
    role: user.role,
    votes: user.votes,
  };

  const token = generateToken(authUser);

  return { user: authUser, token };
}

export function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const user = verifyToken(token);
  if (!user) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  req.user = user;
  next();
}