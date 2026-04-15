<script setup>
import { ref, onMounted } from 'vue'
import { store } from '../store'

const students = ref([])

const fetchStudents = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/students')
    students.value = await res.json()
  } catch (err) {
    console.error("Failed to fetch students")
  }
}

const deleteStudent = async (id) => {
  if (confirm("Are you sure you want to remove this student?")) {
    await fetch(`http://localhost:3000/api/students/${id}`, { method: 'DELETE' })
    await fetchStudents()
  }
}

onMounted(fetchStudents)
</script>

<template>
  <div class="p-6">
    <div style="display:flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h1>Student Registry</h1>
      <router-link v-if="store.user" to="/add-student" class="btn-add">
        + Add New Student
      </router-link>
    </div>

    <table class="student-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Grade</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in students" :key="s.id">
          <td>{{ s.id }}</td>
          <td>{{ s.name }}</td>
          <td>{{ s.grade }}</td>
          <td>
            <div style="display:flex; gap:10px; justify-content:center;">
              <router-link :to="'/details/' + s.id" class="btn-details">Details</router-link>
              
              <button v-if="store.user" @click="deleteStudent(s.id)" class="btn-remove">
                Remove
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.btn-add { background: #22c55e; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; font-weight: bold; }
.student-table { width: 100%; border-collapse: collapse; background: white; }
.student-table th, .student-table td { padding: 12px; border: 1px solid #ddd; text-align: center; }
.btn-details { background: #3b82f6; color: white; padding: 5px 10px; border-radius: 4px; text-decoration: none; font-size: 0.9rem; }
.btn-remove { background: #ef4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; }
</style>