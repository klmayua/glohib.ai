import axios from 'axios'

// Use relative paths - requests go through Next.js API routes
const API_BASE = ''

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login on 401 for non-auth endpoints
    // Don't redirect on /api/auth/me to avoid login loops
    if (error.response?.status === 401) {
      const url = error.config?.url || ''
      if (!url.includes('/api/auth/')) {
        // Clear auth state and redirect for non-auth endpoints
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  register: (data: { email: string; password: string; role: string }) =>
    api.post('/api/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),

  logout: () => api.post('/api/auth/logout'),

  me: () => api.get('/api/auth/me'),
}

export const studentAPI = {
  get: (id: string) => api.get(`/api/students/${id}`),
  create: (data: any) => api.post('/api/students', data),
  update: (id: string, data: any) => api.put(`/api/students/${id}`, data),
  addSkill: (id: string, data: any) => api.post(`/api/students/${id}/skills`, data),
  addEducation: (id: string, data: any) => api.post(`/api/students/${id}/education`, data),
  addExperience: (id: string, data: any) => api.post(`/api/students/${id}/experience`, data),
}

export const internshipAPI = {
  list: (limit = 20, offset = 0) =>
    api.get(`/api/internships?limit=${limit}&offset=${offset}`),

  get: (id: string) =>
    api.get(`/api/internships/${id}`),

  search: (filter: any) =>
    api.post('/api/internships/search', filter),

  apply: (internshipId: string, data: any) =>
    api.post(`/api/internships/${internshipId}/applications`, data),

  getApplications: (internshipId: string) =>
    api.get(`/api/internships/${internshipId}/applications`),

  getStudentApplications: (studentId: string) =>
    api.get(`/api/applications/${studentId}/student`),
}

export const recommendationAPI = {
  recommend: (studentId: string, limit = 20) =>
    api.get(`/api/recommend/${studentId}?limit=${limit}`),

  vectorizeStudent: (data: any) =>
    api.post('/api/vectorize/student', data),

  vectorizeInternship: (data: any) =>
    api.post('/api/vectorize/internship', data),
}

export const videoAPI = {
  get: (id: string) => api.get(`/api/video/${id}`),
  transcode: (id: string) => api.post(`/api/video/${id}/transcode`),
}
