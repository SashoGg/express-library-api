import { reactive } from 'vue'

export const store = reactive({
  user: localStorage.getItem('user') || null,
  
  setUser(username) {
    this.user = username
    localStorage.setItem('user', username)
  },
  
  clearUser() {
    this.user = null
    localStorage.removeItem('user')
  }
})