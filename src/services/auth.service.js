import logger from '#config/logger.js';
import { users } from '#models/user.model.js';
import { db } from '#config/database.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export const hashPassword = async password => {
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword;
  } catch (e) {
    logger.error('hashPassword error:', e);
    throw new Error('Error hashing password');
  }
};

export const createUser = async (name, email, role = 'user', password) => {
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existingUser.length > 0) {
    throw new Error('User with this email already exists');
  }
  const hashedPassword = await hashPassword(password);
  const [newUser] = await db
    .insert(users)
    .values({
      name,
      email,
      role,
      password: hashedPassword,
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    });
  logger.info(`User ${newUser.email} created successfully`);
  return newUser;
};
