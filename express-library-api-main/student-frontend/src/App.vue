<script setup>
import { store } from './store'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = () => {
  store.clearUser()
  router.push('/login')
}
</script>

<template>
  <header style="background: #1f2937; color: white; padding: 15px 25px; display: flex; justify-content: space-between; align-items: center;">
    <div style="display: flex; gap: 20px;">
      <router-link to="/" style="color: white; font-weight: bold; text-decoration: none;">Home</router-link>
      <span style="opacity: 0.7;">Student System</span>
    </div>

    <div>
      <span v-if="store.user" style="margin-right: 20px;">
        Welcome, <strong>{{ store.user }}</strong>
        <button @click="handleLogout" style="margin-left: 15px; background: transparent; color: #ef4444; border: 1px solid #ef4444; padding: 4px 10px; border-radius: 4px; cursor: pointer;">
          Logout
        </button>
      </span>
      <router-link v-else to="/login" class="btn btn-success" style="padding: 6px 20px; text-decoration: none; display: inline-block;">
        Login
      </router-link>
    </div>
  </header>

  <main>
    <router-view />
  </main>
</template>