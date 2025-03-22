<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Developer Dashboard</h1>
      <div class="user-info">
        <button @click="logout" class="logout-btn">Logout</button>
      </div>
    </div>
    <div>
      <div class="input-container">
        <h1>Git Puller</h1>
        <input
          v-model="gitUploader"
          type="text"
          class="input-field"
          placeholder="80532d10-e419-45c3-b3ed-b62df716c560"
        />
        <p>{{ errorMsg }}</p>
        <button @click="submit" class="submit-btn">Submit</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();

const errorMsg = ref('');
const gitUploader = ref('');

function submit() {
  errorMsg.value = 'Waiting Response...';

  const data = $fetch('/api/git-puller', {
    method: 'POST',
    body: JSON.stringify({ server: gitUploader.value }),
    headers: {
      'Content-Type': 'application/json',
    },
    onResponse({ response }) {
      if (response.ok) {
        errorMsg.value = 'Success';
      } else {
        errorMsg.value =
          response._data?.message || 'Failed: ' + response.statusText;
      }
    },
    onResponseError({ response }) {
      console.error(response);
      errorMsg.value =
        response._data?.message || 'Error: ' + response.statusText;
    },
  });
}

function logout() {
  const data = $fetch('/api/logout', {
    onResponse({ response }) {
      console.log(response);

      if (response.ok) {
        router.push('/');
      }
    },
  });
}

async function testAuth() {
  const data = $fetch('/api/test', {
    onResponse({ response }) {
      console.log(response._data);
    },
  });
}
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background-color: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background-color: #e0e0e0;
}

.input-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #e7e4e4;
  border-radius: 8px;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.1);
}

.input-container h1 {
  margin: 0 0 1rem;
  color: #333;
}

.input-field {
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 1rem;
  font-size: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.input-field:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.submit-btn {
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover {
  background-color: #2980b9;
}

p {
  margin: 10px 0;
  color: #e74c3c;
  font-size: 0.9rem;
}

/* Style success message differently */
p:contains('Success') {
  color: #2ecc71;
}
</style>
