export default defineEventHandler(async (event) => {
  deleteCookie(event, 'session_id');
  return {
    statusCode: 200,
  };
});
