<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const router = useRouter()

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    return alert("Passwords do not match!")
  }

  try {
    const res = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username: username.value, 
        password: password.value 
      })
    })

    if (res.ok) {
      alert("Registration successful! Please login.")
      router.push('/login')
    } else {
      const data = await res.json()
      alert(data.message || "Registration failed")
    }
  } catch (err) {
    alert("Server connection error")
  }
}
</script>

<template>
  <div class="container" style="max-width: 450px;">
    <div class="card">
      <h2 style="margin-top: 0; color: #0f172a;">Create Account</h2>
      <p style="color: #64748b; margin-bottom: 2rem;">Join the Student Management System</p>
      
      <label>Username</label>
      <input v-model="username" type="text" placeholder="Choose a username" />

      <label>Password</label>
      <input v-model="password" type="password" placeholder="••••••••" />

      <label>Confirm Password</label>
      <input v-model="confirmPassword" type="password" placeholder="••••••••" />

      <button @click="handleRegister" class="btn-primary" style="width: 100%;">Register</button>
      
      <p style="text-align: center; margin-top: 1.5rem; font-size: 0.9rem;">
        Already have an account? 
        <router-link to="/login" style="color: #10b981; text-decoration: none; font-weight: bold;">Login</router-link>
      </p>
    </div>
  </div>
</template>