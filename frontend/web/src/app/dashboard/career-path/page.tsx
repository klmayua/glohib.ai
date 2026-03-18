'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TrendingUp, ArrowRight, Briefcase, GraduationCap, Target, Star, MapPin, DollarSign } from 'lucide-react'
import { Card, Button, Badge } from '@/components/ui'
import { useDashboardIntegration } from '@/core/integration/dashboardIntegration'
import type { Skill } from '@/features/matching/matchEngine'

export default function CareerPathPage() {
  const router = useRouter()
  const { findMissingSkills, getSkillGap } = useDashboardIntegration()
  const [selectedRole, setSelectedRole] = useState<string>('epidemiologist')

  // Career path data
  const careerPaths = [
    {
      id: 'epidemiologist',
      title: 'Epidemiologist',
      category: 'Research & Analysis',
      description: 'Study disease patterns and develop public health interventions',
      avgSalary: 75000,
      growth: '15%',
      skills: ['Disease Surveillance', 'Statistical Analysis', 'R Programming', 'Outbreak Investigation'],
      nextSteps: [
        { role: 'Junior Epidemiologist', timeline: '0-2 years', type: 'entry' },
        { role: 'Epidemiologist', timeline: '2-5 years', type: 'mid' },
        { role: 'Senior Epidemiologist', timeline: '5-10 years', type: 'senior' },
        { role: 'Epidemiology Director', timeline: '10+ years', type: 'leadership' },
      ],
      recommendedInternships: [
        { title: 'Public Health Research Intern', company: 'CDC', location: 'Atlanta, GA' },
        { title: 'Disease Surveillance Intern', company: 'WHO', location: 'Geneva, Switzerland' },
      ],
    },
    {
      id: 'public_health_analyst',
      title: 'Public Health Analyst',
      category: 'Policy & Analysis',
      description: 'Analyze health data to inform policy decisions and program development',
      avgSalary: 68000,
      growth: '12%',
      skills: ['Data Analysis', 'Health Policy', 'Statistical Analysis', 'Report Writing'],
      nextSteps: [
        { role: 'Junior Analyst', timeline: '0-2 years', type: 'entry' },
        { role: 'Public Health Analyst', timeline: '2-5 years', type: 'mid' },
        { role: 'Senior Analyst', timeline: '5-10 years', type: 'senior' },
        { role: 'Policy Director', timeline: '10+ years', type: 'leadership' },
      ],
      recommendedInternships: [
        { title: 'Health Policy Intern', company: 'Kaiser Family Foundation', location: 'Washington, DC' },
        { title: 'Data Analyst Intern', company: 'State Health Dept', location: 'Remote' },
      ],
    },
    {
      id: 'clinical_research_coordinator',
      title: 'Clinical Research Coordinator',
      category: 'Clinical Research',
      description: 'Manage clinical trials and ensure compliance with research protocols',
      avgSalary: 62000,
      growth: '18%',
      skills: ['Good Clinical Practice', 'IRB Protocols', 'Data Collection', 'Patient Recruitment'],
      nextSteps: [
        { role: 'Clinical Research Assistant', timeline: '0-2 years', type: 'entry' },
        { role: 'Clinical Research Coordinator', timeline: '2-5 years', type: 'mid' },
        { role: 'Senior CRC', timeline: '5-10 years', type: 'senior' },
        { role: 'Clinical Trials Manager', timeline: '10+ years', type: 'leadership' },
      ],
      recommendedInternships: [
        { title: 'Clinical Research Intern', company: 'Mayo Clinic', location: 'Rochester, MN' },
        { title: 'Research Coordinator Intern', company: 'Pfizer', location: 'New York, NY' },
      ],
    },
    {
      id: 'global_health_program_manager',
      title: 'Global Health Program Manager',
      category: 'Program Management',
      description: 'Lead international health initiatives and manage cross-functional teams',
      avgSalary: 85000,
      growth: '20%',
      skills: ['Project Management', 'Stakeholder Management', 'Budget Management', 'Cross-Cultural Communication'],
      nextSteps: [
        { role: 'Program Coordinator', timeline: '0-2 years', type: 'entry' },
        { role: 'Program Manager', timeline: '2-5 years', type: 'mid' },
        { role: 'Senior Program Manager', timeline: '5-10 years', type: 'senior' },
        { role: 'Director of Programs', timeline: '10+ years', type: 'leadership' },
      ],
      recommendedInternships: [
        { title: 'Global Health Intern', company: 'Gates Foundation', location: 'Seattle, WA' },
        { title: 'Program Management Intern', company: 'Partners In Health', location: 'Boston, MA' },
      ],
    },
  ]

  const selectedPath = careerPaths.find(p => p.id === selectedRole)

  // Mock student skills - in real app, fetch from API
  const studentSkills: Skill[] = [
    { name: 'Data Analysis', level: 'intermediate' },
    { name: 'Python', level: 'intermediate' },
    { name: 'Communication', level: 'advanced' },
  ]

  const handleViewInternships = () => {
    router.push('/dashboard/internships')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Career Path Explorer</h1>
        <p className="text-slate-400 text-sm mt-1">Discover your ideal career path in global health</p>
      </div>

      {/* Career Path Selector */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-5 h-5 text-sky-400" />
          <h2 className="font-medium text-white">Select a Career Path</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {careerPaths.map((path) => (
            <button
              key={path.id}
              onClick={() => setSelectedRole(path.id)}
              className={`p-4 rounded-xl border text-left transition-colors duration-150 ${
                selectedRole === path.id
                  ? 'bg-sky-500/20 border-sky-400/30'
                  : 'bg-white/[0.03] border-white/[0.08] hover:border-sky-400/30'
              }`}
            >
              <h3 className="font-medium text-white text-sm">{path.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{path.category}</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Selected Path Details */}
      {selectedPath && (
        <>
          {/* Overview */}
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-white">{selectedPath.title}</h2>
                <p className="text-slate-400 text-sm mt-1">{selectedPath.description}</p>
              </div>
              <Badge variant="info">{selectedPath.category}</Badge>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Avg. Salary</p>
                <p className="text-lg font-semibold text-white">
                  ${selectedPath.avgSalary.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Job Growth</p>
                <p className="text-lg font-semibold text-green-400">+{selectedPath.growth}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Key Skills</p>
                <p className="text-lg font-semibold text-white">{selectedPath.skills.length}</p>
              </div>
            </div>
          </Card>

          {/* Career Progression */}
          <Card>
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-slate-400 opacity-70" />
              Career Progression
            </h3>
            <div className="space-y-3">
              {selectedPath.nextSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.type === 'entry' ? 'bg-sky-500/20 text-sky-400' :
                      step.type === 'mid' ? 'bg-cyan-500/20 text-cyan-400' :
                      step.type === 'senior' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      {index + 1}
                    </div>
                    {index < selectedPath.nextSteps.length - 1 && (
                      <div className="w-0.5 h-8 bg-white/10 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 p-3 rounded-lg bg-white/[0.03] border border-white/[0.08]">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white">{step.role}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{step.timeline}</p>
                      </div>
                      <Badge variant={
                        step.type === 'entry' ? 'info' :
                        step.type === 'mid' ? 'success' :
                        step.type === 'senior' ? 'warning' : 'danger'
                      }>
                        {step.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Required Skills */}
          <Card>
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-slate-400 opacity-70" />
              Required Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedPath.skills.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
            <div className="mt-4 p-4 rounded-lg bg-sky-500/10 border border-sky-400/20">
              <p className="text-sm text-sky-300">
                💡 <strong>Tip:</strong> Build these skills through relevant internships and coursework.
              </p>
            </div>
          </Card>

          {/* Recommended Internships */}
          <Card>
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-slate-400 opacity-70" />
              Recommended Internships
            </h3>
            <div className="space-y-3">
              {selectedPath.recommendedInternships.map((internship, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/[0.03] border border-white/[0.08]"
                >
                  <div>
                    <h4 className="font-medium text-white">{internship.title}</h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      <span>{internship.company}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 opacity-70" />
                        {internship.location}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" onClick={handleViewInternships}>
                    View
                  </Button>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="secondary" onClick={handleViewInternships}>
              Browse All Internships
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        </>
      )}
    </div>
  )
}
