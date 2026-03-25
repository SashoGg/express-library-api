<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../store'

const username = ref('')
const password = ref('')
const router = useRouter()

const handleLogin = async () => {
  if (!username.value || !password.value) return alert("Enter credentials")

  try {
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value })
    })
    const data = await res.json()

    if (res.ok) {
      store.setUser(data.username)
      router.push('/')
    } else {
      alert(data.message)
    }
  } catch (err) {
    alert("Backend error - check terminal")
  }
}
</script>

<template>
  <div class="auth-card">
    <h2>Login</h2>
    
    <div class="form-group">
      <label>Username</label>
      <input v-model="username" class="input-field" type="text" placeholder="Username" />
    </div>

    <div class="form-group">
      <label>Password</label>
      <input v-model="password" class="input-field" type="password" placeholder="Password" />
    </div>

    <button @click="handleLogin" class="btn btn-success">Log In</button>
    
    <p style="margin-top: 1rem;">
      No account? <router-link to="/register">Register</router-link>
    </p>
  </div>
</template>