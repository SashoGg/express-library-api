<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const router = useRouter()

const handleRegister = async () => {
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
      alert("Registration successful!")
      router.push('/login')
    } else {
      const data = await res.json()
      alert(data.message || "Registration failed")
    }
  } catch (err) {
    alert("Backend is not running on port 3000")
  }
}
</script>

<template>
  <div style="padding: 40px; text-align: center; max-width: 300px; margin: auto;">
    <h1>Register</h1>
    <input v-model="username" placeholder="Username" style="display:block; width:100%; margin-bottom:10px; padding:8px;" />
    <input v-model="password" type="password" placeholder="Password" style="display:block; width:100%; margin-bottom:10px; padding:8px;" />
    <button @click="handleRegister" style="width:100%; padding:10px; background:#3b82f6; color:white; border:none; cursor:pointer;">
      Create Account
    </button>
    <p><router-link to="/login">Back to Login</router-link></p>
  </div>
</template>