<script setup>
import { ref, onMounted } from 'vue'

const students = ref([])
const newName = ref('')
const newGrade = ref('')

const fetchStudents = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/students')
    const data = await res.json()
    students.value = Array.isArray(data) ? data : []
  } catch (err) {
    console.error("Fetch error:", err)
  }
}

const addStudent = async () => {
  const gradeVal = parseInt(newGrade.value)
  
  // Frontend Validation
  if (!newName.value || isNaN(gradeVal)) return alert("Please fill in both fields")
  if (gradeVal < 2 || gradeVal > 6) return alert("Grade must be between 2 and 6!")

  try {
    const res = await fetch('http://localhost:3000/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: newName.value, 
        grade: gradeVal 
      })
    })

    const data = await res.json()

    if (res.ok) {
      newName.value = ''
      newGrade.value = ''
      await fetchStudents()
    } else {
      alert("Error: " + (data.message || "Unknown server error"))
    }
  } catch (err) {
    alert("Check terminal: Backend might be down.")
  }
}

const deleteStudent = async (id) => {
  if (confirm("Remove this student?")) {
    await fetch(`http://localhost:3000/api/students/${id}`, { method: 'DELETE' })
    await fetchStudents()
  }
}

onMounted(fetchStudents)
</script>

<template>
  <div class="p-6">
    <h1>Student Registry</h1>

    <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 20px;">
      <div style="display: flex; gap: 15px; align-items: flex-end;">
        <div style="flex: 1;">
          <label style="display:block; font-weight:bold; margin-bottom:5px;">Name</label>
          <input v-model="newName" placeholder="Enter Name" style="width:100%; padding:10px; border:1px solid #ccc; border-radius:4px;" />
        </div>
        <div style="flex: 1;">
          <label style="display:block; font-weight:bold; margin-bottom:5px;">Grade (2-6)</label>
          <input v-model="newGrade" type="number" min="2" max="6" placeholder="2-6" style="width:100%; padding:10px; border:1px solid #ccc; border-radius:4px;" />
        </div>
        <button @click="addStudent" style="background:#22c55e; color:white; border:none; padding: 12px 40px; border-radius:4px; cursor:pointer; font-weight:bold;">
          Add Student
        </button>
      </div>
    </div>

    <table style="width:100%; border-collapse: collapse; background:white; border: 1px solid #ddd;">
      <thead>
        <tr style="background:#f3f4f6;">
          <th style="padding:12px; border:1px solid #ddd;">ID</th>
          <th style="padding:12px; border:1px solid #ddd;">Name</th>
          <th style="padding:12px; border:1px solid #ddd;">Grade</th>
          <th style="padding:12px; border:1px solid #ddd;">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in students" :key="s.id">
          <td style="padding:12px; border:1px solid #ddd; text-align:center;">{{ s.id }}</td>
          <td style="padding:12px; border:1px solid #ddd; text-align:center;">{{ s.name }}</td>
          <td style="padding:12px; border:1px solid #ddd; text-align:center;">{{ s.grade }}</td>
          <td style="padding:12px; border:1px solid #ddd; text-align:center;">
            <button @click="deleteStudent(s.id)" style="background:#ef4444; color:white; border:none; padding:6px 15px; border-radius:4px; cursor:pointer;">Remove</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>