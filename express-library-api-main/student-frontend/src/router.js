import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import LoginView from './views/LoginView.vue'
import RegisterView from './views/RegisterView.vue'
import AddStudent from './views/AddStudent.vue'
import DetailsView from './views/DetailsView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/add-student', component: AddStudent },
  { path: '/details/:id', component: DetailsView }
]

// ... existing imports and routes ...

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router // CHANGE THIS LINE