/**
 * Matching Engine for GlohibAI
 * Calculates compatibility scores between students and internships
 * 
 * @module features/matching/matchEngine
 */

import { getCache, CacheKeys } from '../../core/cache/cache'

export interface Skill {
  id?: string
  name: string
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  years?: number
}

export interface StudentProfile {
  id: string
  skills: Skill[]
  level?: string
  experience?: Array<{ title: string; duration?: string }>
  education?: Array<{ degree?: string; field?: string }>
}

export interface InternshipProfile {
  id: string
  title: string
  requiredSkills: Skill[]
  preferredSkills?: Skill[]
  level?: string
  department?: string
}

export interface MatchResult {
  studentId: string
  internshipId: string
  overallScore: number // 0-100
  skillMatchScore: number
  levelMatchScore: number
  experienceMatchScore: number
  missingSkills: string[]
  matchedSkills: string[]
  recommendations: string[]
}

/**
 * Calculate skill match score between student and internship
 * Uses cosine similarity with skill level weighting
 */
function calculateSkillMatch(studentSkills: Skill[], requiredSkills: Skill[]): {
  score: number
  matched: string[]
  missing: string[]
} {
  if (requiredSkills.length === 0) {
    return { score: 100, matched: [], missing: [] }
  }

  const studentSkillNames = new Set(studentSkills.map(s => s.name.toLowerCase()))
  const requiredSkillNames = requiredSkills.map(s => s.name.toLowerCase())
  
  const matched: string[] = []
  const missing: string[] = []

  // Calculate weighted score based on skill levels
  let totalWeight = 0
  let matchedWeight = 0

  const levelWeights: Record<string, number> = {
    beginner: 0.25,
    intermediate: 0.5,
    advanced: 0.75,
    expert: 1.0,
  }

  for (const reqSkill of requiredSkills) {
    const skillName = reqSkill.name.toLowerCase()
    const weight = levelWeights[reqSkill.level || 'intermediate'] || 0.5
    totalWeight += weight

    if (studentSkillNames.has(skillName)) {
      matched.push(reqSkill.name)
      const studentSkill = studentSkills.find(s => s.name.toLowerCase() === skillName)
      const studentLevel = levelWeights[studentSkill?.level || 'beginner'] || 0.25
      matchedWeight += weight * studentLevel
    } else {
      missing.push(reqSkill.name)
    }
  }

  const score = totalWeight > 0 ? (matchedWeight / totalWeight) * 100 : 100

  return {
    score: Math.round(score),
    matched,
    missing,
  }
}

/**
 * Calculate level compatibility score
 */
function calculateLevelMatch(studentLevel?: string, internshipLevel?: string): number {
  if (!studentLevel || !internshipLevel) {
    return 75 // Default score if levels not specified
  }

  const levelHierarchy: Record<string, number> = {
    'freshman': 1,
    'sophomore': 2,
    'junior': 3,
    'senior': 4,
    'undergraduate': 3,
    'graduate': 5,
    'masters': 5,
    'phd': 6,
    'entry': 2,
    'mid': 4,
    'senior': 5,
    'expert': 6,
  }

  const studentValue = levelHierarchy[studentLevel.toLowerCase()] || 3
  const internshipValue = levelHierarchy[internshipLevel.toLowerCase()] || 3

  // Perfect match = 100, one level off = 75, two levels = 50, etc.
  const diff = Math.abs(studentValue - internshipValue)
  const score = Math.max(0, 100 - (diff * 25))

  return score
}

/**
 * Calculate experience match score
 */
function calculateExperienceMatch(
  studentExperience?: Array<{ title?: string; duration?: string }>,
  internshipLevel?: string
): number {
  if (!studentExperience || studentExperience.length === 0) {
    return internshipLevel === 'entry' ? 80 : 40
  }

  const totalExperience = studentExperience.length
  const hasRelevantTitle = studentExperience.some(exp => 
    exp.title && /(intern|developer|engineer|analyst|research)/i.test(exp.title)
  )

  let score = 50
  if (totalExperience >= 1) score += 15
  if (totalExperience >= 2) score += 15
  if (hasRelevantTitle) score += 20

  return Math.min(100, score)
}

/**
 * Main matching function - calculates comprehensive match score
 * @param student - Student profile with skills
 * @param internship - Internship profile with required skills
 * @param studentLevel - Optional student level override
 * @returns MatchResult with scores and recommendations
 */
export function matchScore(
  student: StudentProfile,
  internship: InternshipProfile,
  studentLevel?: string
): MatchResult {
  // Calculate individual scores
  const skillMatch = calculateSkillMatch(student.skills, internship.requiredSkills)
  const levelScore = calculateLevelMatch(studentLevel || student.level, internship.level)
  const experienceScore = calculateExperienceMatch(student.experience, internship.level)

  // Weighted overall score
  const weights = {
    skills: 0.50,      // 50% - Most important
    level: 0.25,       // 25% - Academic/professional level
    experience: 0.25,  // 25% - Relevant experience
  }

  const overallScore = Math.round(
    skillMatch.score * weights.skills +
    levelScore * weights.level +
    experienceScore * weights.experience
  )

  // Generate recommendations
  const recommendations: string[] = []
  
  if (skillMatch.missing.length > 0) {
    recommendations.push(`Learn these skills: ${skillMatch.missing.slice(0, 3).join(', ')}`)
  }
  
  if (levelScore < 75) {
    recommendations.push('Consider gaining more experience before applying')
  }
  
  if (experienceScore < 60) {
    recommendations.push('Add relevant projects or internships to your profile')
  }

  if (overallScore >= 80) {
    recommendations.push('Strong match! Apply now')
  } else if (overallScore >= 60) {
    recommendations.push('Good match with some skill gaps')
  } else {
    recommendations.push('Consider building more relevant skills first')
  }

  return {
    studentId: student.id,
    internshipId: internship.id,
    overallScore,
    skillMatchScore: skillMatch.score,
    levelMatchScore: levelScore,
    experienceMatchScore: experienceScore,
    missingSkills: skillMatch.missing,
    matchedSkills: skillMatch.matched,
    recommendations,
  }
}

/**
 * Batch match students to multiple internships
 * @param student - Student profile
 * @param internships - Array of internship profiles
 * @returns Array of match results sorted by score
 */
export function batchMatchScore(
  student: StudentProfile,
  internships: InternshipProfile[]
): MatchResult[] {
  const results = internships.map(internship => matchScore(student, internship))
  return results.sort((a, b) => b.overallScore - a.overallScore)
}

/**
 * Cached version of matchScore with automatic TTL
 * @param student - Student profile
 * @param internship - Internship profile
 * @param studentLevel - Optional student level override
 * @returns Cached or calculated MatchResult
 */
export async function cachedMatchScore(
  student: StudentProfile,
  internship: InternshipProfile,
  studentLevel?: string
): Promise<MatchResult> {
  const cache = getCache()
  const cacheKey = CacheKeys.MATCH_SCORES(student.id, internship.id)

  return cache.getOrSet(
    cacheKey,
    async () => matchScore(student, internship, studentLevel),
    10 * 60 * 1000 // 10 minutes TTL
  )
}

/**
 * Get missing skills for a student relative to an internship
 * @param studentSkills - Array of student skills
 * @param requiredSkills - Array of required skills
 * @returns Array of missing skill names
 */
export function getMissingSkills(
  studentSkills: Skill[],
  requiredSkills: Skill[]
): string[] {
  const studentSkillNames = new Set(studentSkills.map(s => s.name.toLowerCase()))
  return requiredSkills
    .filter(s => !studentSkillNames.has(s.name.toLowerCase()))
    .map(s => s.name)
}

export default matchScore
