<template>
  <nav style="padding: 15px; background: #333; color: white; display: flex; justify-content: space-between; align-items: center;">
    <div>
      <router-link to="/" style="color: white; margin-right: 20px; text-decoration: none; font-weight: bold;">Home</router-link>
      <span style="opacity: 0.8;">Student System</span>
    </div>
    <div style="display: flex; align-items: center; gap: 15px;">
      <template v-if="store.username">
        <span>👤 {{ store.username }}</span>
        <button @click="store.logout" style="background: #ff4d4d; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px;">
          Logout
        </button>
      </template>
      
      <router-link v-else to="/login" style="color: white; background: #42b983; padding: 8px 15px; text-decoration: none; border-radius: 4px;">
        Login
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { onMounted } from 'vue';
import { store } from '../store.js';

// When the header mounts, tell the store to check if we are logged in
onMounted(() => {
  store.fetchUser();
});
</script>