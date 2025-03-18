export const useAuth = () => {
  const authenticated = useState('auth', () => false);
  const loading = useState('auth-loading', () => true);

  async function checkAuth() {
    try {
      loading.value = true;
      const data = await $fetch('/api/session');

      if (data) {
        authenticated.value = true;
        return data;
      }

      authenticated.value = false;
      return false;
    } catch (error) {
      authenticated.value = false;
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    try {
      await $fetch('/api/logout', { method: 'POST' });
      authenticated.value = false;
      return true;
    } catch (error) {
      return false;
    }
  }

  return {
    authenticated: computed(() => authenticated.value),
    loading: computed(() => loading.value),
    checkAuth,
    logout,
  };
};
