export default defineEventHandler(async (event) => {
  const cookie = getCookie(event, 'session_id');
  deleteCookie(event, 'session_id');
  return {
    statusCode: 200,
  };
});
