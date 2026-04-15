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
  <header>
    <div style="display: flex; align-items: center; gap: 2rem;">
      <h3 style="margin: 0; letter-spacing: -0.5px;">🎓 StudentSys</h3>
      <nav>
        <router-link to="/" style="color: #94a3b8; text-decoration: none; font-weight: 500;">Dashboard</router-link>
      </nav>
    </div>

    <div v-if="store.user" style="display: flex; align-items: center; gap: 1rem;">
      <span style="font-size: 0.9rem; color: #94a3b8;">Logged in as <b style="color: white;">{{ store.user }}</b></span>
      <button @click="handleLogout" style="background: #334155; color: white; padding: 0.5rem 1rem; font-size: 0.8rem;">Logout</button>
    </div>
    <div v-else>
      <router-link to="/login" class="btn-primary" style="text-decoration: none; padding: 0.5rem 1.5rem; display: inline-block;">Login</router-link>
    </div>
  </header>

  <main class="container">
    <router-view />
  </main>
</template>