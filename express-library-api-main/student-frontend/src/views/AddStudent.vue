<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const name = ref('')
const age = ref('')
const router = useRouter()

const submitForm = async () => {
  const res = await fetch('http://localhost:3000/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name.value, age: parseInt(age.value) })
  })

  if (res.ok) {
    router.push('/') // Go back to the list after adding
  } else {
    alert('Failed to add student')
  }
}
</script>

<template>
  <div class="container">
    <h2>Add New Student</h2>
    <form @submit.prevent="submitForm">
      <input v-model="name" placeholder="Student Name" required />
      <input v-model="age" type="number" placeholder="Age" required />
      <button type="submit">Add Student</button>
    </form>
  </div>
</template>

<style scoped>
.container { padding: 20px; }
input { display: block; margin: 10px 0; padding: 8px; }
</style>