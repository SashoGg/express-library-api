<template>
  <div style="padding: 20px;">
    <h2>Student Registry</h2>
    <table border="1" style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background-color: #f2f2f2;">
          <th>ID</th>
          <th>Name</th>
          <th>Grade</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in students" :key="student.id">
          <td>{{ student.id }}</td>
          <td>{{ student.name }}</td>
          <td>{{ student.grade }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const students = ref([]);

const fetchStudents = async () => {
  try {
    const response = await fetch('http://localhost:3000/students');
    const data = await response.json();
    students.value = data;
  } catch (error) {
    console.error("Backend not found! Is node index.js running?", error);
  }
};

onMounted(fetchStudents);
</script>