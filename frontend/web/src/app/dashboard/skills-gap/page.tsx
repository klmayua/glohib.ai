'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Target, TrendingUp, AlertCircle, CheckCircle, ArrowRight, Book, Calendar } from 'lucide-react'
import { Card, Button, Badge, Progress } from '@/components/ui'

interface SkillGap {
  skill: string
  currentLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  requiredLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  gap: number
  priority: 'high' | 'medium' | 'low'
  resources?: string[]
}

export default function SkillsGapPage() {
  const router = useRouter()
  const [selectedCareer, setSelectedCareer] = useState('epidemiologist')
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([])
  const [overallGap, setOverallGap] = useState(0)

  // Mock student skills - in real app, fetch from API
  const studentSkills = [
    { name: 'Data Analysis', level: 'intermediate' },
    { name: 'Python', level: 'intermediate' },
    { name: 'Communication', level: 'advanced' },
    { name: 'Excel', level: 'advanced' },
  ]

  // Career skill requirements
  const careerRequirements: Record<string, any[]> = {
    epidemiologist: [
      { name: 'Disease Surveillance', level: 'intermediate' },
      { name: 'Statistical Analysis', level: 'advanced' },
      { name: 'R Programming', level: 'intermediate' },
      { name: 'Outbreak Investigation', level: 'intermediate' },
      { name: 'Epidemiological Study Design', level: 'advanced' },
      { name: 'Data Analysis', level: 'intermediate' },
    ],
    'public health analyst': [
      { name: 'Data Analysis', level: 'intermediate' },
      { name: 'Health Policy', level: 'intermediate' },
      { name: 'Statistical Analysis', level: 'intermediate' },
      { name: 'Report Writing', level: 'intermediate' },
      { name: 'Python', level: 'beginner' },
    ],
    'clinical research coordinator': [
      { name: 'Good Clinical Practice', level: 'intermediate' },
      { name: 'IRB Protocols', level: 'intermediate' },
      { name: 'Data Collection', level: 'intermediate' },
      { name: 'Patient Recruitment', level: 'beginner' },
      { name: 'Communication', level: 'intermediate' },
    ],
    'global health program manager': [
      { name: 'Project Management', level: 'advanced' },
      { name: 'Stakeholder Management', level: 'intermediate' },
      { name: 'Budget Management', level: 'intermediate' },
      { name: 'Cross-Cultural Communication', level: 'advanced' },
      { name: 'Communication', level: 'intermediate' },
    ],
  }

  useEffect(() => {
    calculateSkillGaps()
  }, [selectedCareer])

  const calculateSkillGaps = () => {
    const requiredSkills = careerRequirements[selectedCareer] || []
    const studentSkillMap = new Map(studentSkills.map(s => [s.name.toLowerCase(), s]))

    const gaps = requiredSkills.map(reqSkill => {
      const studentSkill = studentSkillMap.get(reqSkill.name.toLowerCase())

      const levelValues = {
        beginner: 1,
        intermediate: 2,
        advanced: 3,
        expert: 4,
      }

      const currentLevel = (studentSkill?.level || 'beginner') as 'beginner' | 'intermediate' | 'advanced' | 'expert'
      const currentVal = levelValues[currentLevel]
      const requiredVal = levelValues[reqSkill.level as keyof typeof levelValues]
      const gap = Math.max(0, requiredVal - currentVal)

      let priority: 'high' | 'medium' | 'low' = 'low'
      if (gap >= 2) priority = 'high'
      else if (gap === 1) priority = 'medium'

      return {
        skill: reqSkill.name,
        currentLevel,
        requiredLevel: reqSkill.level,
        gap,
        priority,
        resources: getLearningResources(reqSkill.name),
      }
    })

    // Filter to only show gaps
    const significantGaps = gaps.filter(g => g.gap > 0)
    
    // Calculate overall gap percentage
    const totalGap = gaps.reduce((sum, g) => sum + (g.gap / 3) * 100, 0)
    const avgGap = gaps.length > 0 ? Math.round(totalGap / gaps.length) : 0

    setSkillGaps(significantGaps.sort((a, b) => b.gap - a.gap))
    setOverallGap(avgGap)
  }

  const getLearningResources = (skill: string): string[] => {
    const resources: Record<string, string[]> = {
      'Disease Surveillance': ['Coursera: Epidemiology Basics', 'CDC Training Portal'],
      'Statistical Analysis': ['edX: Statistics for Public Health', 'Khan Academy Statistics'],
      'R Programming': ['DataCamp: R for Data Science', 'RStudio Primers'],
      'Outbreak Investigation': ['CDC: Principles of Epidemiology', 'WHO Training Materials'],
      'Health Policy': ['Coursera: Health Policy Basics', 'KFF Learning Center'],
      'Project Management': ['Google Project Management Certificate', 'PMI Basics'],
      'Good Clinical Practice': ['CITI Program GCP Training', 'FDA GCP Guidelines'],
    }
    return resources[skill] || ['LinkedIn Learning', 'Coursera', 'edX']
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-400/20'
      case 'medium': return 'text-amber-400 bg-amber-500/10 border-amber-400/20'
      case 'low': return 'text-green-400 bg-green-500/10 border-green-400/20'
    }
  }

  const getLevelProgress = (current: string, required: string) => {
    const levelValues = {
      beginner: 25,
      intermediate: 50,
      advanced: 75,
      expert: 100,
    }
    const currentVal = levelValues[current as keyof typeof levelValues] || 0
    const requiredVal = levelValues[required as keyof typeof levelValues] || 0
    return Math.min(100, Math.round((currentVal / requiredVal) * 100))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Skills Gap Analysis</h1>
        <p className="text-slate-400 text-sm mt-1">Identify skills to develop for your target career</p>
      </div>

      {/* Career Selector */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-5 h-5 text-sky-400" />
          <h2 className="font-medium text-white">Target Career</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.keys(careerRequirements).map((career) => (
            <button
              key={career}
              onClick={() => setSelectedCareer(career)}
              className={`p-3 rounded-lg border text-sm transition-colors duration-150 ${
                selectedCareer === career
                  ? 'bg-sky-500/20 border-sky-400/30 text-white'
                  : 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:border-sky-400/30'
              }`}
            >
              {career.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </button>
          ))}
        </div>
      </Card>

      {/* Overall Gap Score */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-white">Overall Skills Gap</h3>
          <Badge variant={overallGap > 50 ? 'warning' : overallGap > 25 ? 'info' : 'success'}>
            {overallGap > 50 ? 'Significant Gaps' : overallGap > 25 ? 'Moderate Gaps' : 'Minor Gaps'}
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Progress value={100 - overallGap} className="h-3" />
          </div>
          <span className="text-2xl font-semibold text-white">{100 - overallGap}%</span>
        </div>
        <p className="text-sm text-slate-400 mt-2">
          You have {skillGaps.length} skills to develop for this career path
        </p>
      </Card>

      {/* Skills Gap Breakdown */}
      <Card>
        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-slate-400 opacity-70" />
          Skills to Develop
        </h3>
        <div className="space-y-3">
          {skillGaps.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <p className="text-white font-medium">All skills met!</p>
              <p className="text-slate-400 text-sm mt-1">
                You have all the required skills for this career path.
              </p>
            </div>
          ) : (
            skillGaps.map((gap, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getPriorityColor(gap.priority)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-white">{gap.skill}</h4>
                      <Badge className={getPriorityColor(gap.priority)}>
                        {gap.priority} priority
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-slate-400">
                        Current: <span className="text-white">{gap.currentLevel}</span>
                      </span>
                      <span className="text-slate-400">
                        Required: <span className="text-white">{gap.requiredLevel}</span>
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span>Progress</span>
                        <span>{getLevelProgress(gap.currentLevel, gap.requiredLevel)}%</span>
                      </div>
                      <Progress
                        value={getLevelProgress(gap.currentLevel, gap.requiredLevel)}
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
                {gap.resources && gap.resources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/[0.08]">
                    <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
                      <Book className="w-3 h-3" />
                      Recommended Resources:
                    </p>
                    <ul className="space-y-1">
                      {gap.resources.map((resource, i) => (
                        <li key={i} className="text-xs text-slate-300">
                          • {resource}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Action Plan */}
      <Card>
        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-slate-400 opacity-70" />
          Recommended Action Plan
        </h3>
        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.08]">
            <h4 className="font-medium text-white mb-2">Short-term (1-3 months)</h4>
            <ul className="space-y-1 text-sm text-slate-300">
              {skillGaps.filter(g => g.priority === 'high').slice(0, 2).map((gap, i) => (
                <li key={i}>• Start learning {gap.skill}</li>
              ))}
              {skillGaps.filter(g => g.priority === 'high').length === 0 && (
                <li className="text-slate-400">No high-priority gaps</li>
              )}
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.08]">
            <h4 className="font-medium text-white mb-2">Medium-term (3-6 months)</h4>
            <ul className="space-y-1 text-sm text-slate-300">
              {skillGaps.filter(g => g.priority === 'medium').slice(0, 2).map((gap, i) => (
                <li key={i}>• Develop {gap.skill}</li>
              ))}
              {skillGaps.filter(g => g.priority === 'medium').length === 0 && (
                <li className="text-slate-400">Continue building intermediate skills</li>
              )}
            </ul>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          className="flex-1"
          onClick={() => router.push('/dashboard/recommendations')}
        >
          Find Relevant Internships
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => router.push('/dashboard/career-path')}
        >
          Explore Career Paths
        </Button>
      </div>
    </div>
  )
}
