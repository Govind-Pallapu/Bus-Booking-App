import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true, // sends JSESSIONID cookie automatically
  headers: { 'Content-Type': 'application/json' }
})

export default api
