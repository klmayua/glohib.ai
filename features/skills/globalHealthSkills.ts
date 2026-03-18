/**
 * Global Health Skills Module for GlohibAI
 * Defines and manages skills specific to global health internships
 * 
 * @module features/skills/globalHealthSkills
 */

import type { Skill } from '../matching/matchEngine'

/**
 * Global health skill categories
 */
export enum SkillCategory {
  // Technical/Scientific Skills
  EPIDEMIOLOGY = 'epidemiology',
  BIOSTATISTICS = 'biostatistics',
  PUBLIC_HEALTH = 'public_health',
  CLINICAL_RESEARCH = 'clinical_research',
  LABORATORY = 'laboratory',
  DATA_ANALYSIS = 'data_analysis',
  
  // Program Management
  PROJECT_MANAGEMENT = 'project_management',
  MONITORING_EVALUATION = 'monitoring_evaluation',
  GRANT_WRITING = 'grant_writing',
  BUDGET_MANAGEMENT = 'budget_management',
  
  // Communication
  SCIENTIFIC_WRITING = 'scientific_writing',
  HEALTH_COMMUNICATION = 'health_communication',
  COMMUNITY_ENGAGEMENT = 'community_engagement',
  STAKEHOLDER_MANAGEMENT = 'stakeholder_management',
  
  // Cultural Competency
  CROSS_CULTURAL = 'cross_cultural',
  LANGUAGE_SKILLS = 'language_skills',
  CULTURAL_SENSITIVITY = 'cultural_sensitivity',
  
  // Technology
  GIS_MAPPING = 'gis_mapping',
  HEALTH_INFORMATICS = 'health_informatics',
  MOBILE_HEALTH = 'mobile_health',
  TELEMEDECINE = 'telemedicine',
  
  // Policy & Advocacy
  HEALTH_POLICY = 'health_policy',
  ADVOCACY = 'advocacy',
  ETHICS = 'ethics',
  REGULATORY_AFFAIRS = 'regulatory_affairs',
}

/**
 * Core global health skills taxonomy
 */
export const globalHealthSkills: Record<SkillCategory, Skill[]> = {
  [SkillCategory.EPIDEMIOLOGY]: [
    { name: 'Disease Surveillance', level: 'intermediate' },
    { name: 'Outbreak Investigation', level: 'intermediate' },
    { name: 'Contact Tracing', level: 'beginner' },
    { name: 'Epidemiological Study Design', level: 'advanced' },
    { name: 'Infectious Disease Modeling', level: 'advanced' },
  ],
  
  [SkillCategory.BIOSTATISTICS]: [
    { name: 'Statistical Analysis', level: 'intermediate' },
    { name: 'R Programming', level: 'intermediate' },
    { name: 'SAS', level: 'intermediate' },
    { name: 'Stata', level: 'intermediate' },
    { name: 'Python for Statistics', level: 'intermediate' },
    { name: 'Regression Analysis', level: 'advanced' },
    { name: 'Survival Analysis', level: 'advanced' },
  ],
  
  [SkillCategory.PUBLIC_HEALTH]: [
    { name: 'Health Promotion', level: 'intermediate' },
    { name: 'Disease Prevention', level: 'intermediate' },
    { name: 'Community Health Assessment', level: 'intermediate' },
    { name: 'Health Equity', level: 'intermediate' },
    { name: 'Social Determinants of Health', level: 'intermediate' },
    { name: 'One Health Approach', level: 'advanced' },
  ],
  
  [SkillCategory.CLINICAL_RESEARCH]: [
    { name: 'Clinical Trial Design', level: 'advanced' },
    { name: 'Good Clinical Practice (GCP)', level: 'intermediate' },
    { name: 'IRB Protocols', level: 'intermediate' },
    { name: 'Informed Consent', level: 'intermediate' },
    { name: 'Data Collection', level: 'beginner' },
    { name: 'Patient Recruitment', level: 'intermediate' },
  ],
  
  [SkillCategory.LABORATORY]: [
    { name: 'PCR', level: 'intermediate' },
    { name: 'ELISA', level: 'intermediate' },
    { name: 'Cell Culture', level: 'intermediate' },
    { name: 'Microscopy', level: 'beginner' },
    { name: 'Sample Collection', level: 'beginner' },
    { name: 'Biosafety', level: 'intermediate' },
  ],
  
  [SkillCategory.DATA_ANALYSIS]: [
    { name: 'Data Visualization', level: 'intermediate' },
    { name: 'Tableau', level: 'intermediate' },
    { name: 'Power BI', level: 'intermediate' },
    { name: 'Excel Advanced', level: 'intermediate' },
    { name: 'SQL', level: 'intermediate' },
    { name: 'Machine Learning', level: 'advanced' },
    { name: 'Qualitative Analysis', level: 'intermediate' },
    { name: 'NVivo', level: 'beginner' },
  ],
  
  [SkillCategory.PROJECT_MANAGEMENT]: [
    { name: 'Agile Methodology', level: 'intermediate' },
    { name: 'Scrum', level: 'beginner' },
    { name: 'Risk Management', level: 'intermediate' },
    { name: 'Stakeholder Coordination', level: 'intermediate' },
    { name: 'Timeline Management', level: 'beginner' },
    { name: 'Resource Allocation', level: 'intermediate' },
  ],
  
  [SkillCategory.MONITORING_EVALUATION]: [
    { name: 'Logical Framework', level: 'intermediate' },
    { name: 'Theory of Change', level: 'intermediate' },
    { name: 'KPI Development', level: 'intermediate' },
    { name: 'Impact Assessment', level: 'advanced' },
    { name: 'Data Quality Assurance', level: 'intermediate' },
  ],
  
  [SkillCategory.GRANT_WRITING]: [
    { name: 'Proposal Development', level: 'intermediate' },
    { name: 'Budget Justification', level: 'intermediate' },
    { name: 'Needs Assessment', level: 'intermediate' },
    { name: 'Literature Review', level: 'intermediate' },
    { name: 'NIH Grants', level: 'advanced' },
    { name: 'Foundation Grants', level: 'intermediate' },
  ],
  
  [SkillCategory.BUDGET_MANAGEMENT]: [
    { name: 'Financial Planning', level: 'intermediate' },
    { name: 'Budget Tracking', level: 'beginner' },
    { name: 'Cost-Effectiveness Analysis', level: 'advanced' },
    { name: 'Financial Reporting', level: 'intermediate' },
  ],
  
  [SkillCategory.SCIENTIFIC_WRITING]: [
    { name: 'Manuscript Preparation', level: 'intermediate' },
    { name: 'Abstract Writing', level: 'intermediate' },
    { name: 'Technical Documentation', level: 'intermediate' },
    { name: 'Peer Review', level: 'advanced' },
    { name: 'LaTeX', level: 'beginner' },
  ],
  
  [SkillCategory.HEALTH_COMMUNICATION]: [
    { name: 'Risk Communication', level: 'intermediate' },
    { name: 'Health Literacy', level: 'intermediate' },
    { name: 'Social Marketing', level: 'intermediate' },
    { name: 'Media Relations', level: 'beginner' },
    { name: 'Presentation Skills', level: 'intermediate' },
  ],
  
  [SkillCategory.COMMUNITY_ENGAGEMENT]: [
    { name: 'Participatory Approaches', level: 'intermediate' },
    { name: 'Focus Groups', level: 'intermediate' },
    { name: 'Community Organizing', level: 'intermediate' },
    { name: 'Capacity Building', level: 'intermediate' },
  ],
  
  [SkillCategory.STAKEHOLDER_MANAGEMENT]: [
    { name: 'Government Relations', level: 'intermediate' },
    { name: 'NGO Partnerships', level: 'intermediate' },
    { name: 'Donor Relations', level: 'intermediate' },
    { name: 'Public-Private Partnerships', level: 'advanced' },
  ],
  
  [SkillCategory.CROSS_CULTURAL]: [
    { name: 'Cultural Adaptation', level: 'intermediate' },
    { name: 'Intercultural Communication', level: 'intermediate' },
    { name: 'Global Health Ethics', level: 'intermediate' },
    { name: 'Working in Resource-Limited Settings', level: 'advanced' },
  ],
  
  [SkillCategory.LANGUAGE_SKILLS]: [
    { name: 'French', level: 'intermediate' },
    { name: 'Spanish', level: 'intermediate' },
    { name: 'Portuguese', level: 'intermediate' },
    { name: 'Arabic', level: 'intermediate' },
    { name: 'Mandarin', level: 'intermediate' },
    { name: 'Swahili', level: 'beginner' },
    { name: 'Hindi', level: 'intermediate' },
  ],
  
  [SkillCategory.CULTURAL_SENSITIVITY]: [
    { name: 'Cultural Humility', level: 'intermediate' },
    { name: 'Gender Sensitivity', level: 'intermediate' },
    { name: 'Religious Competency', level: 'intermediate' },
    { name: 'Indigenous Health Perspectives', level: 'advanced' },
  ],
  
  [SkillCategory.GIS_MAPPING]: [
    { name: 'ArcGIS', level: 'intermediate' },
    { name: 'QGIS', level: 'intermediate' },
    { name: 'Spatial Analysis', level: 'intermediate' },
    { name: 'Geospatial Data Collection', level: 'beginner' },
    { name: 'Health Mapping', level: 'intermediate' },
  ],
  
  [SkillCategory.HEALTH_INFORMATICS]: [
    { name: 'Electronic Health Records', level: 'intermediate' },
    { name: 'DHIS2', level: 'intermediate' },
    { name: 'OpenMRS', level: 'intermediate' },
    { name: 'Health Data Standards', level: 'advanced' },
    { name: 'Interoperability', level: 'advanced' },
  ],
  
  [SkillCategory.MOBILE_HEALTH]: [
    { name: 'mHealth App Design', level: 'intermediate' },
    { name: 'SMS Campaigns', level: 'beginner' },
    { name: 'Mobile Data Collection', level: 'intermediate' },
    { name: 'ODK', level: 'intermediate' },
    { name: 'CommCare', level: 'intermediate' },
  ],
  
  [SkillCategory.TELEMEDICINE]: [
    { name: 'Telehealth Platforms', level: 'intermediate' },
    { name: 'Remote Patient Monitoring', level: 'intermediate' },
    { name: 'Digital Diagnostics', level: 'advanced' },
    { name: 'Virtual Care Coordination', level: 'intermediate' },
  ],
  
  [SkillCategory.HEALTH_POLICY]: [
    { name: 'Policy Analysis', level: 'intermediate' },
    { name: 'Health Systems Strengthening', level: 'advanced' },
    { name: 'Universal Health Coverage', level: 'intermediate' },
    { name: 'Health Financing', level: 'advanced' },
    { name: 'WHO Guidelines', level: 'intermediate' },
  ],
  
  [SkillCategory.ADVOCACY]: [
    { name: 'Policy Advocacy', level: 'intermediate' },
    { name: 'Campaign Development', level: 'intermediate' },
    { name: 'Coalition Building', level: 'intermediate' },
    { name: 'Legislative Testimony', level: 'advanced' },
  ],
  
  [SkillCategory.ETHICS]: [
    { name: 'Research Ethics', level: 'intermediate' },
    { name: 'Bioethics', level: 'intermediate' },
    { name: 'Human Subjects Protection', level: 'intermediate' },
    { name: 'Data Privacy', level: 'intermediate' },
    { name: 'GDPR Compliance', level: 'intermediate' },
  ],
  
  [SkillCategory.REGULATORY_AFFAIRS]: [
    { name: 'FDA Regulations', level: 'intermediate' },
    { name: 'EMA Regulations', level: 'intermediate' },
    { name: 'Clinical Trial Registration', level: 'intermediate' },
    { name: 'Medical Device Approval', level: 'advanced' },
  ],
}

/**
 * Get all skills as a flat array
 */
export function getAllGlobalHealthSkills(): Skill[] {
  return Object.values(globalHealthSkills).flat()
}

/**
 * Get skills by category
 */
export function getSkillsByCategory(category: SkillCategory): Skill[] {
  return globalHealthSkills[category] || []
}

/**
 * Find missing skills from a student's profile compared to global health standards
 * @param studentSkills - Array of student's current skills
 * @param targetRole - Optional target role category to compare against
 * @returns Array of recommended skills to acquire
 */
export function missingSkills(
  studentSkills: Skill[],
  targetRole?: SkillCategory
): Skill[] {
  const studentSkillNames = new Set(
    studentSkills.map(s => s.name.toLowerCase())
  )

  let targetSkills: Skill[] = []

  if (targetRole) {
    targetSkills = globalHealthSkills[targetRole] || []
  } else {
    // Use core skills across all categories
    targetSkills = getAllGlobalHealthSkills()
      .filter(s => s.level === 'intermediate')
      .slice(0, 20)
  }

  return targetSkills.filter(
    skill => !studentSkillNames.has(skill.name.toLowerCase())
  )
}

/**
 * Get skill recommendations based on career goals
 */
export function getSkillRecommendations(
  currentSkills: Skill[],
  careerGoal: string
): {
  toDevelop: Skill[]
  toAdd: Skill[]
} {
  const goalMapping: Record<string, SkillCategory[]> = {
    epidemiologist: [SkillCategory.EPIDEMIOLOGY, SkillCategory.BIOSTATISTICS, SkillCategory.DATA_ANALYSIS],
    'public health analyst': [SkillCategory.PUBLIC_HEALTH, SkillCategory.DATA_ANALYSIS, SkillCategory.HEALTH_POLICY],
    'clinical research coordinator': [SkillCategory.CLINICAL_RESEARCH, SkillCategory.ETHICS, SkillCategory.PROJECT_MANAGEMENT],
    'global health program manager': [SkillCategory.PROJECT_MANAGEMENT, SkillCategory.MONITORING_EVALUATION, SkillCategory.STAKEHOLDER_MANAGEMENT],
    'health policy advisor': [SkillCategory.HEALTH_POLICY, SkillCategory.ADVOCACY, SkillCategory.EPIDEMIOLOGY],
    'mhealth specialist': [SkillCategory.MOBILE_HEALTH, SkillCategory.HEALTH_INFORMATICS, SkillCategory.DATA_ANALYSIS],
  }

  const relevantCategories = goalMapping[careerGoal.toLowerCase()] || [
    SkillCategory.PUBLIC_HEALTH,
    SkillCategory.DATA_ANALYSIS,
  ]

  const currentSkillNames = new Set(currentSkills.map(s => s.name.toLowerCase()))
  
  const toDevelop = currentSkills.filter(skill =>
    relevantCategories.some(cat =>
      globalHealthSkills[cat]?.some(s => s.name.toLowerCase() === skill.name.toLowerCase())
    )
  )

  const toAdd = relevantCategories
    .flatMap(cat => globalHealthSkills[cat] || [])
    .filter(skill => !currentSkillNames.has(skill.name.toLowerCase()))
    .slice(0, 10)

  return { toDevelop, toAdd }
}

/**
 * Calculate skill gap score for a specific role
 */
export function calculateSkillGap(
  studentSkills: Skill[],
  targetRole: SkillCategory
): {
  gapScore: number // 0-100 (lower is better)
  missingCount: number
  totalRequired: number
  prioritySkills: Skill[]
} {
  const requiredSkills = globalHealthSkills[targetRole] || []
  const studentSkillNames = new Set(
    studentSkills.map(s => s.name.toLowerCase())
  )

  const missing = requiredSkills.filter(
    skill => !studentSkillNames.has(skill.name.toLowerCase())
  )

  const gapScore = requiredSkills.length > 0
    ? Math.round((missing.length / requiredSkills.length) * 100)
    : 0

  // Priority skills are intermediate and advanced level missing skills
  const prioritySkills = missing
    .filter(s => s.level === 'intermediate' || s.level === 'advanced')
    .slice(0, 5)

  return {
    gapScore,
    missingCount: missing.length,
    totalRequired: requiredSkills.length,
    prioritySkills,
  }
}

export default missingSkills
