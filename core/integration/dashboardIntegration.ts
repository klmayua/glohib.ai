/**
 * Dashboard Integration Layer
 * Safely integrates new core modules with existing dashboard
 * 
 * DO NOT modify existing dashboard files directly
 * Import and use these integration hooks instead
 */

'use client'

import { useCallback, useState } from 'react'
import { matchScore, type StudentProfile, type InternshipProfile, type MatchResult } from '../../features/matching/matchEngine'
import { apply as submitApplication, type ApplicationData, type ApplicationResult } from '../../features/apply/applyEngine'
import { missingSkills, type Skill } from '../../features/skills/globalHealthSkills'
import { getCache, CacheKeys } from '../../core/cache/cache'

/**
 * Hook for using match scoring in dashboard components
 */
export function useMatchEngine() {
  const [isCalculating, setIsCalculating] = useState(false)
  const [lastMatch, setLastMatch] = useState<MatchResult | null>(null)

  const calculateMatch = useCallback(
    async (student: StudentProfile, internship: InternshipProfile): Promise<MatchResult> => {
      setIsCalculating(true)
      try {
        const result = matchScore(student, internship)
        setLastMatch(result)
        
        // Cache the result
        const cache = getCache()
        await cache.set(
          CacheKeys.MATCH_SCORES(student.id, internship.id),
          result,
          10 * 60 * 1000
        )
        
        return result
      } finally {
        setIsCalculating(false)
      }
    },
    []
  )

  const getCachedMatch = useCallback(
    async (studentId: string, internshipId: string): Promise<MatchResult | null> => {
      const cache = getCache()
      return cache.get(CacheKeys.MATCH_SCORES(studentId, internshipId))
    },
    []
  )

  return {
    calculateMatch,
    getCachedMatch,
    isCalculating,
    lastMatch,
  }
}

/**
 * Hook for handling applications in dashboard components
 */
export function useApplication() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [application, setApplication] = useState<ApplicationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const submit = useCallback(
    async (
      data: ApplicationData,
      studentProfile?: StudentProfile,
      internshipProfile?: InternshipProfile
    ): Promise<ApplicationResult> => {
      setIsSubmitting(true)
      setError(null)
      
      try {
        const result = await submitApplication(data, studentProfile, internshipProfile)
        setApplication(result)
        return result
      } catch (err: any) {
        setError(err.message || 'Failed to submit application')
        throw err
      } finally {
        setIsSubmitting(false)
      }
    },
    []
  )

  const reset = useCallback(() => {
    setApplication(null)
    setError(null)
  }, [])

  return {
    submit,
    isSubmitting,
    application,
    error,
    reset,
  }
}

/**
 * Hook for skill management in dashboard components
 */
export function useSkills() {
  const [missing, setMissing] = useState<Skill[]>([])

  const findMissingSkills = useCallback(
    (studentSkills: Skill[], targetRole?: string) => {
      const result = missingSkills(studentSkills, targetRole as any)
      setMissing(result)
      return result
    },
    []
  )

  const getSkillGap = useCallback(
    (studentSkills: Skill[], targetRole: string) => {
      const categories = {
        epidemiology: 'EPIDEMIOLOGY',
        biostatistics: 'BIOSTATISTICS',
        'public health': 'PUBLIC_HEALTH',
        'clinical research': 'CLINICAL_RESEARCH',
        'data analysis': 'DATA_ANALYSIS',
        'project management': 'PROJECT_MANAGEMENT',
        'health policy': 'HEALTH_POLICY',
      } as const

      const categoryKey = Object.entries(categories).find(
        ([key]) => targetRole.toLowerCase().includes(key)
      )?.[1]

      if (!categoryKey) {
        return {
          gapScore: 0,
          missingCount: 0,
          totalRequired: 0,
          prioritySkills: [],
        }
      }

      // Import calculateSkillGap dynamically
      return import('../../features/skills/globalHealthSkills').then(
        ({ calculateSkillGap }) => {
          const gap = calculateSkillGap(studentSkills, categoryKey as any)
          setMissing(gap.prioritySkills)
          return gap
        }
      )
    },
    []
  )

  return {
    missingSkills: missing,
    findMissingSkills,
    getSkillGap,
  }
}

/**
 * Combined hook for dashboard integration
 * Provides all matching, application, and skills functionality
 */
export function useDashboardIntegration() {
  const matchEngine = useMatchEngine()
  const application = useApplication()
  const skills = useSkills()

  /**
   * Quick apply to an internship with automatic match calculation
   */
  const quickApplyToInternship = useCallback(
    async (
      student: StudentProfile,
      internship: InternshipProfile,
      coverLetter?: string
    ): Promise<ApplicationResult> => {
      // Calculate match first
      const match = await matchEngine.calculateMatch(student, internship)
      
      // Submit application
      return application.submit(
        {
          studentId: student.id,
          internshipId: internship.id,
          coverLetter,
        },
        student,
        internship
      )
    },
    [matchEngine, application]
  )

  return {
    // Match engine
    ...matchEngine,
    
    // Application
    submitApplication: application.submit,
    isSubmitting: application.isSubmitting,
    application: application.application,
    applicationError: application.error,
    
    // Skills
    ...skills,
    
    // Combined operations
    quickApplyToInternship,
  }
}

export default useDashboardIntegration
