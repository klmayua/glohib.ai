'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, User, Mail, Phone, MapPin, GraduationCap, Save, CheckCircle } from 'lucide-react'
import { Card, Button, Input, Badge, Textarea } from '@/components/ui'
import Link from 'next/link'
import { useDashboardStore } from '@/store/zustandStore'

interface Skill {
  id?: string
  name: string
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}

interface Education {
  id?: string
  institution: string
  degree: string
  field: string
  startYear: string
  endYear: string
}

interface Experience {
  id?: string
  title: string
  company: string
  startDate: string
  endDate: string
  description: string
}

export default function EditProfilePage() {
  const router = useRouter()
  const { user, setUser } = useDashboardStore()
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    bio: '',
    linkedInUrl: '',
    portfolioUrl: '',
  })

  const [skills, setSkills] = useState<Skill[]>([])
  const [newSkill, setNewSkill] = useState('')

  const [education, setEducation] = useState<Education[]>([])
  const [experience, setExperience] = useState<Experience[]>([])

  useEffect(() => {
    // In real app, fetch user profile data here
    // For now, using mock data
    setFormData(prev => ({
      ...prev,
      name: user?.name || 'Student User',
      email: user?.email || 'student@example.com',
    }))
  }, [user])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills(prev => [...prev, { name: newSkill.trim(), level: 'intermediate' }])
      setNewSkill('')
    }
  }

  const handleRemoveSkill = (index: number) => {
    setSkills(prev => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // In real app, call API to update profile
      // await api.put('/api/v1/students/:id', { ...formData, skills, education, experience })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSaveSuccess(true)
      setTimeout(() => {
        setSaveSuccess(false)
        router.push('/dashboard/profile')
      }, 1500)
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Link href="/dashboard/profile">
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </Button>
      </Link>

      <div>
        <h1 className="text-2xl font-semibold text-white">Edit Profile</h1>
        <p className="text-slate-400 text-sm mt-1">Update your personal information and professional details</p>
      </div>

      {/* Basic Information */}
      <Card>
        <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-slate-400 opacity-70" />
          Basic Information
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="your.email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
            <Input
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Location</label>
            <Input
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="City, State"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Bio</label>
            <Textarea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">LinkedIn URL</label>
            <Input
              value={formData.linkedInUrl}
              onChange={(e) => handleInputChange('linkedInUrl', e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Portfolio URL</label>
            <Input
              value={formData.portfolioUrl}
              onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
              placeholder="https://yourportfolio.com"
            />
          </div>
        </div>
      </Card>

      {/* Skills */}
      <Card>
        <h2 className="text-lg font-medium text-white mb-4">Skills</h2>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill (e.g., Python, Product Management)"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
            />
            <Button onClick={handleAddSkill} variant="secondary">Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <Badge key={index} className="flex items-center gap-2">
                {skill.name}
                <button
                  onClick={() => handleRemoveSkill(index)}
                  className="text-slate-400 hover:text-white"
                >
                  ×
                </button>
              </Badge>
            ))}
            {skills.length === 0 && (
              <p className="text-slate-400 text-sm">No skills added yet. Add your first skill above.</p>
            )}
          </div>
        </div>
      </Card>

      {/* Education */}
      <Card>
        <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-slate-400 opacity-70" />
          Education
        </h2>
        <div className="space-y-4">
          {education.map((edu, index) => (
            <div key={index} className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.08]">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-white">{edu.institution}</h3>
                  <p className="text-sm text-slate-400">{edu.degree} in {edu.field}</p>
                  <p className="text-xs text-slate-500">{edu.startYear} - {edu.endYear}</p>
                </div>
                <button
                  onClick={() => setEducation(prev => prev.filter((_, i) => i !== index))}
                  className="text-slate-400 hover:text-white"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
          <Button variant="secondary" className="w-full" onClick={() => {
            setEducation(prev => [...prev, {
              institution: '',
              degree: '',
              field: '',
              startYear: '',
              endYear: '',
            }])
          }}>
            Add Education
          </Button>
        </div>
      </Card>

      {/* Experience */}
      <Card>
        <h2 className="text-lg font-medium text-white mb-4">Experience</h2>
        <div className="space-y-4">
          {experience.map((exp, index) => (
            <div key={index} className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.08]">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-white">{exp.title}</h3>
                  <p className="text-sm text-slate-400">{exp.company}</p>
                  <p className="text-xs text-slate-500">{exp.startDate} - {exp.endDate}</p>
                  <p className="text-sm text-slate-300 mt-2">{exp.description}</p>
                </div>
                <button
                  onClick={() => setExperience(prev => prev.filter((_, i) => i !== index))}
                  className="text-slate-400 hover:text-white"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
          <Button variant="secondary" className="w-full" onClick={() => {
            setExperience(prev => [...prev, {
              title: '',
              company: '',
              startDate: '',
              endDate: '',
              description: '',
            }])
          }}>
            Add Experience
          </Button>
        </div>
      </Card>

      {/* Save Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
        <p className="text-sm text-slate-400">
          Make sure all information is accurate before saving.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => router.push('/dashboard/profile')}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  )
}
