import axios from 'axios'

const API_URL = '/api/v1/users/'  // adjust if your users endpoint is different

const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('access_token')
    if (!token) return null

    const res = await axios.get(`${API_URL}me/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.data
  } catch (err) {
    console.error('Failed to fetch current user:', err)
    return null
  }
}

export default {
  getCurrentUser
}
