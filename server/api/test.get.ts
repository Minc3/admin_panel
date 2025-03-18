import jwt from 'jsonwebtoken';

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  try {
    const cookie = getCookie(event, 'session_id');

    if (!cookie) {
      return { message: 'You are not logged in' };
    }

    await jwt.verify(cookie, config.JWT_SECRET);

    return { message: 'You are logged in!' };
  } catch (error) {
    return { message: 'Not logged in!' };
  }
});
