import jwt from 'jsonwebtoken';

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  try {
    const cookie = getCookie(event, 'session_id');

    if (!cookie) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials',
      });
    }

    await jwt.verify(cookie, config.JWT_SECRET);

    return { statusCode: 200 };
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials',
    });
  }
});
