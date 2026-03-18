/**
 * Core API Client for GlohibAI
 * Provides centralized HTTP communication with backend services
 * 
 * @module core/api/apiClient
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

// API Base URLs for different services
const API_BASES = {
  IDENTITY: process.env.NEXT_PUBLIC_API_IDENTITY || 'http://localhost:8080',
  STUDENT: process.env.NEXT_PUBLIC_API_STUDENT || 'http://localhost:8082',
  INTERNSHIP: process.env.NEXT_PUBLIC_API_INTERNSHIP || 'http://localhost:8083',
  RECOMMENDATION: process.env.NEXT_PUBLIC_API_RECOMMENDATION || 'http://localhost:8007',
  VIDEO: process.env.NEXT_PUBLIC_API_VIDEO || 'http://localhost:4000',
}

// Create axios instance with default config
const createApiClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 30000,
  })

  // Request interceptor - add auth token
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  // Response interceptor - handle errors
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Clear token and redirect to login
        localStorage.removeItem('auth_token')
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }
      return Promise.reject(error)
    }
  )

  return client
}

// Create service-specific clients
const identityClient = createApiClient(API_BASES.IDENTITY)
const studentClient = createApiClient(API_BASES.STUDENT)
const internshipClient = createApiClient(API_BASES.INTERNSHIP)
const recommendationClient = createApiClient(API_BASES.RECOMMENDATION)
const videoClient = createApiClient(API_BASES.VIDEO)

/**
 * Generic GET request handler
 * @param url - API endpoint URL
 * @param config - Optional axios config
 * @returns Promise with response data
 */
export async function apiGet<T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await identityClient.get(url, config)
  return response.data
}

/**
 * Generic POST request handler
 * @param url - API endpoint URL
 * @param data - Request payload
 * @param config - Optional axios config
 * @returns Promise with response data
 */
export async function apiPost<T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await identityClient.post(url, data, config)
  return response.data
}

/**
 * Generic PUT request handler
 * @param url - API endpoint URL
 * @param data - Request payload
 * @param config - Optional axios config
 * @returns Promise with response data
 */
export async function apiPut<T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await identityClient.put(url, data, config)
  return response.data
}

/**
 * Generic DELETE request handler
 * @param url - API endpoint URL
 * @param config - Optional axios config
 * @returns Promise with response data
 */
export async function apiDelete<T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await identityClient.delete(url, config)
  return response.data
}

// Service-specific API functions
export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    apiPost('/api/v1/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    apiPost('/api/v1/auth/login', data),
  
  logout: () => apiPost('/api/v1/auth/logout'),
  
  me: () => apiGet('/api/v1/auth/me'),
  
  refreshToken: () => apiPost('/api/v1/auth/refresh'),
}

export const studentAPI = {
  get: (id: string) => studentClient.get(`/api/v1/students/${id}`).then(r => r.data),
  create: (data: any) => studentClient.post('/api/v1/students', data).then(r => r.data),
  update: (id: string, data: any) => studentClient.put(`/api/v1/students/${id}`, data).then(r => r.data),
  addSkill: (id: string, data: any) => studentClient.post(`/api/v1/students/${id}/skills`, data).then(r => r.data),
  addEducation: (id: string, data: any) => studentClient.post(`/api/v1/students/${id}/education`, data).then(r => r.data),
  addExperience: (id: string, data: any) => studentClient.post(`/api/v1/students/${id}/experience`, data).then(r => r.data),
}

export const internshipAPI = {
  list: (limit = 20, offset = 0) =>
    internshipClient.get(`/api/v1/internships?limit=${limit}&offset=${offset}`).then(r => r.data),
  
  get: (id: string) =>
    internshipClient.get(`/api/v1/internships/${id}`).then(r => r.data),
  
  search: (filter: any) =>
    internshipClient.post('/api/v1/internships/search', filter).then(r => r.data),
  
  apply: (internshipId: string, data: any) =>
    internshipClient.post(`/api/v1/internships/${internshipId}/applications`, data).then(r => r.data),
  
  getApplications: (internshipId: string) =>
    internshipClient.get(`/api/v1/internships/${internshipId}/applications`).then(r => r.data),
  
  getStudentApplications: (studentId: string) =>
    internshipClient.get(`/api/v1/applications/${studentId}/student`).then(r => r.data),
}

export const recommendationAPI = {
  recommend: (studentId: string, limit = 20) =>
    recommendationClient.get(`/api/v1/recommend/${studentId}?limit=${limit}`).then(r => r.data),
  
  vectorizeStudent: (data: any) =>
    recommendationClient.post('/api/v1/vectorize/student', data).then(r => r.data),
  
  vectorizeInternship: (data: any) =>
    recommendationClient.post('/api/v1/vectorize/internship', data).then(r => r.data),
  
  trackClick: (studentId: string, internshipId: string) =>
    recommendationClient.post('/api/v1/track/click', { student_id: studentId, internship_id: internshipId }).then(r => r.data),
}

export const videoAPI = {
  get: (id: string) => videoClient.get(`/api/v1/video/${id}`).then(r => r.data),
  transcode: (id: string) => videoClient.post(`/api/v1/video/${id}/transcode`).then(r => r.data),
  getUploadUrl: (id: string) => videoClient.get(`/api/v1/video/${id}/upload-url`).then(r => r.data),
}

// Export clients for direct use if needed
export { identityClient, studentClient, internshipClient, recommendationClient, videoClient }
