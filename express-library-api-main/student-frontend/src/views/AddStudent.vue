<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../store'

const name = ref('')
const grade = ref('')
const router = useRouter()

// Safety: Redirect if someone tries to access this page while logged out
if (!store.user) {
  router.push('/login')
}

const handleAdd = async () => {
  const numGrade = parseInt(grade.value)
  if (!name.value || isNaN(numGrade)) return alert("Please fill all fields")
  if (numGrade < 2 || numGrade > 6) return alert("Grade must be between 2 and 6")

  const res = await fetch('http://localhost:3000/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name.value, grade: numGrade })
  })

  if (res.ok) {
    router.push('/') // Redirect back to home after success
  } else {
    alert("Error saving student to database")
  }
}
</script>

<template>
  <div class="auth-card">
    <h2>Add New Student</h2>
    <div class="form-group">
      <label>Student Name</label>
      <input v-model="name" class="input-field" type="text" placeholder="Enter name..." />
    </div>
    <div class="form-group">
      <label>Grade (2-6)</label>
      <input v-model="grade" class="input-field" type="number" min="2" max="6" />
    </div>
    <div style="display:flex; gap:10px;">
      <button @click="handleAdd" class="btn btn-success" style="flex:2;">Save Student</button>
      <button @click="router.push('/')" class="btn" style="flex:1; background:#6b7280; color:white;">Cancel</button>
    </div>
  </div>
</template>