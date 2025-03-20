import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { executeQuery } from '../utils/db';

const config = useRuntimeConfig();
const saltRounds = 10;

const AuthSchema = z.object({
  username: z.string().toLowerCase(),
  password: z.string().min(2),
});

type AuthInput = z.infer<typeof AuthSchema>;

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const parsedBody = AuthSchema.safeParse(body);

  if (!parsedBody.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid input',
      data: parsedBody.error.errors,
    });
  }

  const { username, password } = parsedBody.data;

  try {
    const user = await executeQuery<any[]>(
      'SELECT password FROM users WHERE username = ?',
      [username]
    );

    if (!user || user.length === 0) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials',
      });
    }

    const pass = await verifyPassword(password, user[0].password);

    if (!pass) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials',
      });
    }

    const token = jwt.sign({ username }, config.JWT_SECRET, {
      expiresIn: '10m',
    });

    setCookie(event, 'session_id', token, {
      httpOnly: true,
      sameSite: 'strict',
    });

    return {
      statusCode: 200,
    };
  } catch (error: any) {
    console.error('Authentication error:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message,
    });
  }
});

async function hashPassword(plainTextPassword: string) {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(plainTextPassword, salt);
    return hashedPassword;
  } catch (error) {}
}

async function verifyPassword(
  plainTextPassword: string,
  hashedPassword: string
) {
  try {
    const match = await bcrypt.compare(plainTextPassword, hashedPassword);
    return match;
  } catch (error) {}
}
