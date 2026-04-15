<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { store } from '../store'

const route = useRoute()
const router = useRouter()
const student = ref(null)

onMounted(async () => {
  const res = await fetch('http://localhost:3000/api/students')
  const all = await res.json()
  student.value = all.find(s => s.id == route.params.id)
})

const deleteStudent = async () => {
  if (confirm("Delete this student?")) {
    await fetch(`http://localhost:3000/api/students/${student.value.id}`, { method: 'DELETE' })
    router.push('/')
  }
}
</script>

<template>
  <div class="p-6" v-if="student">
    <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #ddd; max-width: 400px;">
      <h2>Student Details</h2>
      <p><strong>ID:</strong> {{ student.id }}</p>
      <p><strong>Name:</strong> {{ student.name }}</p>
      <p><strong>Grade:</strong> {{ student.grade }}</p>
      <hr />
      <div style="display:flex; gap:10px; margin-top:20px;">
        <button @click="router.push('/')" class="btn" style="background:#6b7280; color:white;">Back</button>
        
        <button v-if="store.user" @click="deleteStudent" style="background:#ef4444; color:white; border:none; padding:10px; border-radius:4px; cursor:pointer;">
          Remove Student
        </button>
      </div>
    </div>
  </div>
</template>