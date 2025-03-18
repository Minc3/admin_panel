<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Developer Dashboard</h1>
      <div class="user-info">
        <button @click="logout" class="logout-btn">Logout</button>
      </div>
    </div>
    <div>
      <button @click="testAuth" class="logout-btn">
        Test Auth (Prints to console)
      </button>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();

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
}
</style>
