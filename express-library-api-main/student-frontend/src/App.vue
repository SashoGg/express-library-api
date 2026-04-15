<script setup>
import { store } from './store'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const router = useRouter()

// EXERCISE REQUIREMENT: Fetch username status on load
onMounted(() => {
  store.checkAuth()
})

const handleLogout = () => {
  store.clearUser()
  router.push('/login')
}
</script>

<template>
  <header style="background: #1f2937; color: white; padding: 15px 25px; display: flex; justify-content: space-between; align-items: center;">
    <div>
      <router-link to="/" style="color: white; font-weight: bold; text-decoration: none; margin-right: 20px;">Home</router-link>
      <span>Student System</span>
    </div>

    <div>
      <span v-if="store.user">
        Welcome, <strong>{{ store.user }}</strong>
        <button @click="handleLogout" style="margin-left: 15px; color: #ef4444; border: 1px solid #ef4444; background: none; cursor: pointer; border-radius: 4px; padding: 2px 8px;">Logout</button>
      </span>
      <router-link v-else to="/login" style="color: #22c55e; text-decoration: none;">Login</router-link>
    </div>
  </header>
  <main><router-view /></main>
</template>