'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, User, Save, CheckCircle, Plus, X } from 'lucide-react'
import { Card, Button, Input, Badge, Textarea } from '@/components/ui'
import Link from 'next/link'

interface ProfileEditData {
  name: string
  phone: string
  location: string
  bio: string
  linkedInUrl: string
  portfolioUrl: string
  skills: { name: string; level: string }[]
  education: { institution: string; degree: string; field: string; startYear: string; endYear: string }[]
  experience: { title: string; company: string; startDate: string; endDate: string; description: string; isCurrent: boolean }[]
}

export default function EditProfilePage() {
  const router = useRouter()
  const [formData, setFormData] = useState<ProfileEditData>({
    name: '', phone: '', location: '', bio: '', linkedInUrl: '', portfolioUrl: '',
    skills: [], education: [], experience: [],
  })
  const [newSkill, setNewSkill] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile', { credentials: 'include' })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      const user = data.user
      const sp = user?.studentProfile

      setFormData({
        name: user?.name || '',
        phone: sp?.phone || '',
        location: sp?.currentLocation || '',
        bio: sp?.bio || '',
        linkedInUrl: sp?.linkedinUrl || '',
        portfolioUrl: sp?.portfolioUrl || '',
        skills: sp?.skills?.map((s: any) => ({ name: s.name, level: s.level })) || [],
        education: sp?.education?.map((e: any) => ({
          institution: e.institution, degree: e.degree || '', field: e.fieldOfStudy || '',
          startYear: e.startDate ? new Date(e.startDate).getFullYear().toString() : '',
          endYear: e.endDate ? new Date(e.endDate).getFullYear().toString() : '',
        })) || [],
        experience: sp?.experience?.map((e: any) => ({
          title: e.position, company: e.company,
          startDate: e.startDate ? new Date(e.startDate).toISOString().split('T')[0] : '',
          endDate: e.endDate ? new Date(e.endDate).toISOString().split('T')[0] : '',
          description: e.description || '', isCurrent: e.isCurrent || false,
        })) || [],
      })
    } catch (err) {
      console.error('Error loading profile:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof ProfileEditData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, { name: newSkill.trim(), level: 'Intermediate' }] }))
      setNewSkill('')
    }
  }

  const handleRemoveSkill = (index: number) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error('Failed to save')
      setSaveSuccess(true)
      setTimeout(() => router.push('/dashboard/profile'), 1500)
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-12 text-slate-400">Loading profile...</div>
  }

  return (
    <div className="space-y-6">
      <Link href="/dashboard/profile">
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Profile
        </Button>
      </Link>

      <div>
        <h1 className="text-2xl font-semibold text-white">Edit Profile</h1>
        <p className="text-slate-400 text-sm mt-1">Update your personal information and professional details</p>
      </div>

      {/* Basic Information */}
      <Card>
        <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-slate-400 opacity-70" /> Basic Information
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
            <Input value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Your full name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
            <Input value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} placeholder="+1 (555) 123-4567" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Location</label>
            <Input value={formData.location} onChange={(e) => handleInputChange('location', e.target.value)} placeholder="City, Country" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Bio</label>
            <Textarea value={formData.bio} onChange={(e) => handleInputChange('bio', e.target.value)} placeholder="Tell us about yourself..." rows={4} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">LinkedIn URL</label>
            <Input value={formData.linkedInUrl} onChange={(e) => handleInputChange('linkedInUrl', e.target.value)} placeholder="https://linkedin.com/in/yourprofile" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Portfolio URL</label>
            <Input value={formData.portfolioUrl} onChange={(e) => handleInputChange('portfolioUrl', e.target.value)} placeholder="https://yourportfolio.com" />
          </div>
        </div>
      </Card>

      {/* Skills */}
      <Card>
        <h2 className="text-lg font-medium text-white mb-4">Skills</h2>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add a skill..." onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())} />
            <Button onClick={handleAddSkill} variant="secondary">Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <Badge key={index} className="flex items-center gap-2">
                {skill.name} ({skill.level})
                <button onClick={() => handleRemoveSkill(index)} className="text-slate-400 hover:text-white">×</button>
              </Badge>
            ))}
            {formData.skills.length === 0 && <p className="text-slate-400 text-sm">No skills added yet.</p>}
          </div>
        </div>
      </Card>

      {/* Education */}
      <Card>
        <h2 className="text-lg font-medium text-white mb-4">Education</h2>
        <div className="space-y-4">
          {formData.education.map((edu, index) => (
            <div key={index} className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.08]">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-white">{edu.institution || 'New Institution'}</h3>
                  <p className="text-sm text-slate-400">{edu.degree} in {edu.field}</p>
                  <p className="text-xs text-slate-500">{edu.startYear} - {edu.endYear || 'Present'}</p>
                </div>
                <button onClick={() => setFormData(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== index) }))} className="text-slate-400 hover:text-white">×</button>
              </div>
            </div>
          ))}
          <Button variant="secondary" className="w-full" onClick={() => {
            setFormData(prev => ({ ...prev, education: [...prev.education, { institution: '', degree: '', field: '', startYear: '', endYear: '' }] }))
          }}>
            <Plus className="w-4 h-4 mr-2" /> Add Education
          </Button>
        </div>
      </Card>

      {/* Experience */}
      <Card>
        <h2 className="text-lg font-medium text-white mb-4">Experience</h2>
        <div className="space-y-4">
          {formData.experience.map((exp, index) => (
            <div key={index} className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.08]">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-white">{exp.title || 'New Position'}</h3>
                  <p className="text-sm text-slate-400">{exp.company}</p>
                  <p className="text-xs text-slate-500">{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</p>
                </div>
                <button onClick={() => setFormData(prev => ({ ...prev, experience: prev.experience.filter((_, i) => i !== index) }))} className="text-slate-400 hover:text-white">×</button>
              </div>
            </div>
          ))}
          <Button variant="secondary" className="w-full" onClick={() => {
            setFormData(prev => ({ ...prev, experience: [...prev.experience, { title: '', company: '', startDate: '', endDate: '', description: '', isCurrent: false }] }))
          }}>
            <Plus className="w-4 h-4 mr-2" /> Add Experience
          </Button>
        </div>
      </Card>

      {/* Save Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
        <p className="text-sm text-slate-400">Make sure all information is accurate before saving.</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => router.push('/dashboard/profile')}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : saveSuccess ? (<><CheckCircle className="w-4 h-4 mr-2" /> Saved!</>) : (<><Save className="w-4 h-4 mr-2" /> Save Changes</>)}
          </Button>
        </div>
      </div>
    </div>
  )
}
