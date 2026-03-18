/**
 * Application Engine for GlohibAI
 * Handles internship application submission and tracking
 * 
 * @module features/apply/applyEngine
 */

import { apiPost, internshipAPI } from '../../core/api/apiClient'
import { getCache, CacheKeys } from '../../core/cache/cache'
import { matchScore, type MatchResult } from '../matching/matchEngine'
import type { StudentProfile, InternshipProfile } from '../matching/matchEngine'

export interface ApplicationData {
  studentId: string
  internshipId: string
  coverLetter?: string
  resumeUrl?: string
  portfolioUrl?: string
  linkedInUrl?: string
  additionalInfo?: Record<string, any>
}

export interface ApplicationResult {
  id: string
  applicationId: string
  status: 'submitted' | 'under_review' | 'accepted' | 'rejected' | 'withdrawn'
  submittedAt: string
  matchScore?: MatchResult
  nextSteps: string[]
}

export interface ApplicationStatus {
  id: string
  status: string
  updatedAt: string
  employer?: {
    companyName: string
    contactEmail?: string
  }
  interview?: {
    scheduled: boolean
    date?: string
    type?: string
  }
}

/**
 * Validate application data before submission
 */
function validateApplication(data: ApplicationData): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!data.studentId) {
    errors.push('Student ID is required')
  }

  if (!data.internshipId) {
    errors.push('Internship ID is required')
  }

  if (data.coverLetter && data.coverLetter.length < 50) {
    errors.push('Cover letter must be at least 50 characters')
  }

  if (data.coverLetter && data.coverLetter.length > 2000) {
    errors.push('Cover letter must be less than 2000 characters')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Submit application for an internship
 * @param data - Application data
 * @param studentProfile - Optional student profile for match scoring
 * @param internshipProfile - Optional internship profile for match scoring
 * @returns Application result with status and next steps
 */
export async function apply(
  data: ApplicationData,
  studentProfile?: StudentProfile,
  internshipProfile?: InternshipProfile
): Promise<ApplicationResult> {
  // Validate application data
  const validation = validateApplication(data)
  if (!validation.valid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
  }

  try {
    // Calculate match score if profiles provided
    let matchResult: MatchResult | undefined
    
    if (studentProfile && internshipProfile) {
      matchResult = matchScore(studentProfile, internshipProfile)
      
      // Don't apply if match score is too low (optional business logic)
      if (matchResult.overallScore < 30) {
        console.warn(`Low match score (${matchResult.overallScore}%) for application`)
      }
    }

    // Submit application via API
    const applicationPayload = {
      student_id: data.studentId,
      cover_letter: data.coverLetter,
      resume_url: data.resumeUrl,
      portfolio_url: data.portfolioUrl,
      linkedin_url: data.linkedInUrl,
      additional_info: data.additionalInfo,
      match_score: matchResult?.overallScore,
    }

    const response = await internshipAPI.apply(data.internshipId, applicationPayload)
    
    // Generate next steps based on application status
    const nextSteps = generateNextSteps(response.status || 'submitted')

    const result: ApplicationResult = {
      id: response.id || response.application_id,
      applicationId: response.id || response.application_id,
      status: response.status || 'submitted',
      submittedAt: response.created_at || new Date().toISOString(),
      matchScore: matchResult,
      nextSteps,
    }

    // Cache the application status
    const cache = getCache()
    await cache.set(
      CacheKeys.APPLICATION_STATUS(result.applicationId),
      result,
      30 * 60 * 1000 // 30 minutes TTL
    )

    return result
  } catch (error: any) {
    console.error('Application submission failed:', error)
    throw new Error(
      error.response?.data?.message || 'Failed to submit application. Please try again.'
    )
  }
}

/**
 * Generate next steps based on application status
 */
function generateNextSteps(status: string): string[] {
  const steps: Record<string, string[]> = {
    submitted: [
      'Monitor your email for updates',
      'Check application status in dashboard',
      'Continue exploring other opportunities',
    ],
    under_review: [
      'Employer is reviewing your application',
      'Prepare for potential interview',
      'Research the company',
    ],
    accepted: [
      'Congratulations! Review the offer details',
      'Respond to the employer by the deadline',
      'Prepare for onboarding',
    ],
    rejected: [
      'Continue applying to other positions',
      'Review feedback if provided',
      'Improve skills based on match analysis',
    ],
    interview: [
      'Confirm interview schedule',
      'Prepare answers to common questions',
      'Research the company and role',
      'Test your technology setup',
    ],
  }

  return steps[status] || steps['submitted']
}

/**
 * Get application status from cache or API
 */
export async function getApplicationStatus(
  applicationId: string
): Promise<ApplicationStatus | null> {
  const cache = getCache()
  
  // Try cache first
  const cached = await cache.get<ApplicationStatus>(
    CacheKeys.APPLICATION_STATUS(applicationId)
  )
  
  if (cached) {
    return cached
  }

  // Fetch from API (would need to be implemented in backend)
  try {
    // This would call a real API endpoint
    // const response = await apiGet(`/api/v1/applications/${applicationId}`)
    // await cache.set(CacheKeys.APPLICATION_STATUS(applicationId), response)
    // return response
    return null
  } catch {
    return null
  }
}

/**
 * Withdraw an application
 */
export async function withdrawApplication(
  applicationId: string,
  reason?: string
): Promise<boolean> {
  try {
    // This would call a real API endpoint
    // await apiPost(`/api/v1/applications/${applicationId}/withdraw`, { reason })
    
    // Invalidate cache
    const cache = getCache()
    await cache.delete(CacheKeys.APPLICATION_STATUS(applicationId))
    
    return true
  } catch {
    return false
  }
}

/**
 * Quick apply with minimal information
 * @param internshipId - Internship to apply for
 * @param studentId - Student applying
 * @returns Application result
 */
export async function quickApply(
  internshipId: string,
  studentId: string
): Promise<ApplicationResult> {
  return apply({
    studentId,
    internshipId,
  })
}

export default apply
