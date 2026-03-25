<template>
  <div style="padding: 20px; font-family: sans-serif;">
    <h2>Student Details</h2>
    
    <div v-if="student" style="border: 1px solid #ccc; padding: 15px; border-radius: 8px; max-width: 300px;">
      <p><strong>ID:</strong> {{ student.id }}</p>
      <p><strong>Name:</strong> {{ student.name }}</p>
      <p><strong>Grade:</strong> {{ student.grade }}</p>
      <hr>
      <router-link to="/">← Back to List</router-link>
    </div>
    
    <div v-else>
      <p>Loading student info...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const student = ref(null);

const fetchSingleStudent = async () => {
  try {
    // UPDATED: Now using the proxy path
    const response = await fetch(`/api/students/${route.params.id}`);
    student.value = await response.json();
  } catch (error) {
    console.error("Error fetching details:", error);
  }
};

onMounted(fetchSingleStudent);
</script>