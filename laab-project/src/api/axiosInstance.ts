import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://api.escuelajs.co/api/v1', // Platzi API URL
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export default apiClient
