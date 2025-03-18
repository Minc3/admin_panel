export default defineNuxtRouteMiddleware(async (to) => {
  try {
    const { checkAuth } = useAuth();
    const session = await checkAuth();

    if (!session && to.path !== '/') {
      return await navigateTo('/', { replace: true });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return await navigateTo('/', { replace: true });
  }
});
