<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../store'

const username = ref('')
const password = ref('')
const router = useRouter()

// EXERCISE REQUIREMENT: use the watch function to redirect
watch(() => store.user, (newUser) => {
  if (newUser) {
    router.push('/')
  }
}, { immediate: true })

const handleLogin = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value })
    })
    const data = await res.json()
    if (res.ok) {
      store.setUser(data.username) // This change triggers the 'watch' above
    } else {
      alert(data.message)
    }
  } catch (err) {
    alert("Login failed")
  }
}
</script>

<template>
  <div class="auth-card">
    <h2>Login</h2>
    <div class="form-group">
      <label>Username</label>
      <input v-model="username" class="input-field" type="text" />
    </div>
    <div class="form-group">
      <label>Password</label>
      <input v-model="password" class="input-field" type="password" />
    </div>
    <button @click="handleLogin" class="btn btn-success">Log In</button>
    <p style="margin-top:1rem;">No account? <router-link to="/register">Register</router-link></p>
  </div>
</template>