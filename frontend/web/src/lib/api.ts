import axios from 'axios'

const API_IDENTITY = process.env.API_IDENTITY || 'http://localhost:8080'
const API_STUDENT = process.env.API_STUDENT || 'http://localhost:8082'
const API_INTERNSHIP = process.env.API_INTERNSHIP || 'http://localhost:8083'
const API_RECOMMENDATION = process.env.API_RECOMMENDATION || 'http://localhost:8007'
const API_VIDEO = process.env.API_VIDEO || 'http://localhost:4000'

export const api = axios.create({
  baseURL: API_IDENTITY,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  register: (data: { email: string; password: string; role: string }) =>
    api.post('/api/v1/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/api/v1/auth/login', data),
  
  logout: () => api.post('/api/v1/auth/logout'),
  
  me: () => api.get('/api/v1/auth/me'),
}

export const studentAPI = {
  get: (id: string) => api.get(`/api/v1/students/${id}`),
  create: (data: any) => api.post('/api/v1/students', data),
  update: (id: string, data: any) => api.put(`/api/v1/students/${id}`, data),
  addSkill: (id: string, data: any) => api.post(`/api/v1/students/${id}/skills`, data),
  addEducation: (id: string, data: any) => api.post(`/api/v1/students/${id}/education`, data),
  addExperience: (id: string, data: any) => api.post(`/api/v1/students/${id}/experience`, data),
}

export const internshipAPI = {
  list: (limit = 20, offset = 0) =>
    api.get(`/api/v1/internships?limit=${limit}&offset=${offset}`),
  
  get: (id: string) =>
    api.get(`/api/v1/internships/${id}`),
  
  search: (filter: any) =>
    api.post('/api/v1/internships/search', filter),
  
  apply: (internshipId: string, data: any) =>
    api.post(`/api/v1/internships/${internshipId}/applications`, data),
  
  getApplications: (internshipId: string) =>
    api.get(`/api/v1/internships/${internshipId}/applications`),
  
  getStudentApplications: (studentId: string) =>
    api.get(`/api/v1/applications/${studentId}/student`),
}

export const recommendationAPI = {
  recommend: (studentId: string, limit = 20) =>
    api.get(`/api/v1/recommend/${studentId}?limit=${limit}`),
  
  vectorizeStudent: (data: any) =>
    api.post('/api/v1/vectorize/student', data),
  
  vectorizeInternship: (data: any) =>
    api.post('/api/v1/vectorize/internship', data),
}

export const videoAPI = {
  get: (id: string) => api.get(`/api/v1/video/${id}`),
  transcode: (id: string) => api.post(`/api/v1/video/${id}/transcode`),
}
