/**
 * Page Enhancement Utilities
 * Safe, non-destructive enhancements for existing pages
 * 
 * Import and use these utilities to add functionality
 * without modifying existing page code
 * 
 * @module core/enhancements/pageEnhancements
 */

import type { internshipAPI, recommendationAPI } from '../../core/api/apiClient'
import type { MatchResult } from '../../features/matching/matchEngine'

/**
 * Enhanced internship data fetcher with caching and error handling
 * Use this instead of direct API calls for better reliability
 */
export async function fetchInternshipsWithCache(
  limit = 20,
  offset = 0,
  cache?: { get: (key: string) => Promise<any>; set: (key: string, value: any) => Promise<void> }
) {
  const cacheKey = `internships:${limit}:${offset}`
  
  // Try cache first
  if (cache) {
    const cached = await cache.get(cacheKey)
    if (cached) {
      return cached
    }
  }

  try {
    // In real implementation, call actual API
    // const response = await internshipAPI.list(limit, offset)
    
    // Mock response for now
    const response = {
      internships: [],
      total: 0,
      hasMore: false,
    }

    // Cache the response
    if (cache) {
      await cache.set(cacheKey, response)
    }

    return response
  } catch (error) {
    console.error('Error fetching internships:', error)
    return {
      internships: [],
      total: 0,
      hasMore: false,
      error: 'Failed to load internships',
    }
  }
}

/**
 * Enhanced application submitter with validation and error handling
 */
export async function submitApplicationWithValidation(
  internshipId: string,
  studentId: string,
  coverLetter?: string,
  onProgress?: (status: 'submitting' | 'success' | 'error') => void
) {
  // Validate inputs
  if (!internshipId || !studentId) {
    onProgress?.('error')
    throw new Error('Internship ID and Student ID are required')
  }

  if (coverLetter && coverLetter.length < 50) {
    onProgress?.('error')
    throw new Error('Cover letter must be at least 50 characters')
  }

  try {
    onProgress?.('submitting')

    // In real implementation, call actual API
    // const response = await internshipAPI.apply(internshipId, {
    //   student_id: studentId,
    //   cover_letter: coverLetter,
    // })

    // Mock success
    const response = {
      id: `app_${Date.now()}`,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    }

    onProgress?.('success')
    return response
  } catch (error) {
    console.error('Application submission failed:', error)
    onProgress?.('error')
    throw error
  }
}

/**
 * Enhanced recommendations fetcher with match score calculation
 */
export async function fetchRecommendationsWithMatch(
  studentId: string,
  limit = 20,
  calculateMatch?: (student: any, internship: any) => Promise<MatchResult>
) {
  try {
    // In real implementation, call actual API
    // const response = await recommendationAPI.recommend(studentId, limit)
    
    const response = {
      recommendations: [],
      studentId,
    }

    // If match calculator provided, enrich with match scores
    if (calculateMatch && response.recommendations.length > 0) {
      // const enriched = await Promise.all(
      //   response.recommendations.map(async (internship: any) => {
      //     const match = await calculateMatch({ id: studentId }, internship)
      //     return { ...internship, matchScore: match }
      //   })
      // )
      // response.recommendations = enriched
    }

    return response
  } catch (error) {
    console.error('Error fetching recommendations:', error)
    return {
      recommendations: [],
      studentId,
      error: 'Failed to load recommendations',
    }
  }
}

/**
 * Loading state helper for smooth UX
 */
export function createLoadingState<T>(
  promise: Promise<T>,
  initialState: T,
  onLoadingChange?: (loading: boolean) => void
): Promise<T> {
  onLoadingChange?.(true)
  
  return promise
    .then(result => {
      onLoadingChange?.(false)
      return result
    })
    .catch(error => {
      onLoadingChange?.(false)
      throw error
    })
}

/**
 * Error handler with user-friendly messages
 */
export function handleApiError(error: any, context: string = 'Operation'): {
  userMessage: string
  technicalDetails: string
  retryable: boolean
} {
  const errorMessages: Record<string, string> = {
    '401': 'Please log in to continue',
    '403': 'You do not have permission to perform this action',
    '404': 'The requested resource was not found',
    '500': 'A server error occurred. Please try again later',
    '503': 'Service temporarily unavailable',
    'NETWORK_ERROR': 'Please check your internet connection',
    'TIMEOUT': 'Request timed out. Please try again',
  }

  const statusCode = error.response?.status?.toString() || error.code || 'UNKNOWN'
  const userMessage = errorMessages[statusCode] || `Failed to ${context.toLowerCase()}`
  const technicalDetails = error.message || 'Unknown error'
  const retryable = statusCode === '500' || statusCode === '503' || statusCode === 'NETWORK_ERROR' || statusCode === 'TIMEOUT'

  return {
    userMessage,
    technicalDetails,
    retryable,
  }
}

/**
 * Toast notification helper (non-invasive)
 */
export function showToast(
  message: string,
  type: 'success' | 'error' | 'info' = 'info',
  duration = 3000
) {
  // Create toast element
  const toast = document.createElement('div')
  toast.className = `
    fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50
    transition-all duration-300 transform translate-y-0 opacity-100
    ${type === 'success' ? 'bg-green-500/90 text-white' : ''}
    ${type === 'error' ? 'bg-red-500/90 text-white' : ''}
    ${type === 'info' ? 'bg-slate-700/90 text-white' : ''}
  `
  toast.textContent = message
  toast.style.minWidth = '200px'
  toast.style.textAlign = 'center'

  document.body.appendChild(toast)

  // Remove after duration
  setTimeout(() => {
    toast.style.opacity = '0'
    toast.style.transform = 'translateY(20px)'
    setTimeout(() => toast.remove(), 300)
  }, duration)
}

/**
 * Safe data transformer with fallback values
 */
export function transformWithFallback<T, R>(
  data: T | null | undefined,
  transformer: (data: T) => R,
  fallback: R
): R {
  if (!data) {
    return fallback
  }
  try {
    return transformer(data)
  } catch (error) {
    console.error('Transformation failed:', error)
    return fallback
  }
}

/**
 * Debounce helper for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return 'Today'
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)} weeks ago`
  } else if (diffDays < 365) {
    return `${Math.floor(diffDays / 30)} months ago`
  } else {
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default {
  fetchInternshipsWithCache,
  submitApplicationWithValidation,
  fetchRecommendationsWithMatch,
  createLoadingState,
  handleApiError,
  showToast,
  transformWithFallback,
  debounce,
  formatDate,
  formatCurrency,
}
