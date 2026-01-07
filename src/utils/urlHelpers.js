// src/utils/urlHelpers.js
export const resolveMediaUrl = (url) => {
  if (!url) return null
  
  // If it's already an absolute URL, return as is
  if (url.startsWith('http')) {
    return url
  }
  
  // If it's a relative URL starting with /media/, prepend the backend URL
  if (url.startsWith('/media/')) {
    const backendUrl = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8000'
    return `${backendUrl}${url}`
  }
  
  // If it's just a filename, construct the full URL
  const backendUrl = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8000'
  return `${backendUrl}/media/${url}`
}