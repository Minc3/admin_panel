<template>
  <div class="container">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>Please sign in to continue</h1>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              id="username"
              v-model="loginForm.username"
              type="text"
              placeholder="Enter your username"
              required
              :disabled="isLoading"
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="loginForm.password"
              type="password"
              placeholder="Enter your password"
              required
              :disabled="isLoading"
            />
          </div>

          <button type="submit" class="login-button" :disabled="isLoading">
            {{ isLoading ? 'Signing In...' : 'Sign In' }}
          </button>

          <p class="error-message" v-if="errorMsg">{{ errorMsg }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const isLoading = ref(false);
const errorMsg = ref('');

const router = useRouter();

const loginForm = reactive({
  username: '',
  password: '',
});

const { data: sessionData } = await useFetch('/api/session', {
  // onResponseError: () => {
  //   console.log('No active session found');
  // },
});

watchEffect(() => {
  if (sessionData.value) {
    router.push('/dashboard');
  }
});

const handleLogin = async () => {
  errorMsg.value = '';
  isLoading.value = true;

  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: loginForm.username,
        password: loginForm.password,
      }),
    });

    if (response.status === 429) {
      throw new Error('Rate limited. Please try again later');
    }

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    router.push('/dashboard');
  } catch (error) {
    errorMsg.value = error.message || 'Failed to login. Please try again';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.container {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}

.login-container {
  padding-top: 8%;
  min-height: 100vh;
  display: flex;
  min-height: auto;
  justify-content: center;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h1 {
  color: #2c3e50;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.login-header p {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  transition: border-color 0.2s;
  outline: none;
  box-sizing: border-box;
}

.form-group input:focus {
  border-color: #3498db;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.forgot-password {
  color: #3498db;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.forgot-password:hover {
  color: #2980b9;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-button:hover:not(:disabled) {
  background-color: #2980b9;
}

.login-button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.error-message {
  color: #e74c3c;
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
}
</style>
