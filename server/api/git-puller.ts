import jwt from 'jsonwebtoken';
import { string } from 'zod';

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const cookie = getCookie(event, 'session_id');

  if (!cookie) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials',
    });
  }

  await jwt.verify(cookie, config.JWT_SECRET);

  const body = await readBody(event);

  if (typeof body.server === 'string' && body.server.length > 0) {
    console.log('body.server', body.server);

    try {
      const gitPull = await $fetch(
        `http://172.17.0.1:3001/update/${body.server}`,
        {
          method: 'GET',
        }
      );
      return { statusCode: 200 };
    } catch (error) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Error pulling from git',
      });
    }
  }

  throw createError({
    statusCode: 400,
    statusMessage: 'No server specified',
  });
});
