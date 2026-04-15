import { reactive } from 'vue'

export const store = reactive({
  user: localStorage.getItem('user') || null,
  
  // EXERCISE REQUIREMENT: Function that fetches login status
  async checkAuth() {
    try {
      const res = await fetch('http://localhost:3000/api/is-logged')
      const data = await res.json()
      if (!data.loggedIn) this.clearUser()
    } catch (err) {
      console.error("Auth check failed")
    }
  },

  setUser(username) {
    this.user = username
    localStorage.setItem('user', username)
  },
  
  clearUser() {
    this.user = null
    localStorage.removeItem('user')
  }
})