'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Phone, MapPin, GraduationCap, Briefcase, Star, Save, Edit, Award } from 'lucide-react'
import { Card, Button, Badge, Skeleton } from '@/components/ui'
import Link from 'next/link'

interface ProfileData {
  user: {
    id: string
    email: string
    name: string
    role: string
    studentProfile?: {
      firstName: string
      lastName: string
      phone: string
      currentLocation: string
      university: string
      major: string
      graduationYear: number
      degreeLevel: string
      gpa: number
      bio: string
      linkedinUrl: string
      githubUrl: string
      portfolioUrl: string
      profileCompleteness: number
      skills: any[]
      education: any[]
      experience: any[]
      interests: any[]
      savedInternships: any[]
    }
    employerProfile?: any
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile', { credentials: 'include' })
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setProfile(data)
    } catch (err) {
      console.error('Profile fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Failed to load profile</p>
        <Button onClick={fetchProfile} className="mt-4">Retry</Button>
      </div>
    )
  }

  const { user } = profile
  const sp = user.studentProfile
  const name = sp ? `${sp.firstName} ${sp.lastName}` : user.name || user.email

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">My Profile</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your personal information and preferences</p>
        </div>
        <Link href="/dashboard/profile/edit">
          <Button variant="secondary"><Edit className="w-4 h-4 mr-2" />Edit Profile</Button>
        </Link>
      </div>

      {/* Profile Overview */}
      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-white text-2xl font-semibold">
            {name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-medium text-white">{name}</h2>
            <p className="text-slate-400">{user.email}</p>
            {sp && (
              <Badge className="mt-2">{sp.university || 'Student'}</Badge>
            )}
          </div>
        </div>

        {sp && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-slate-300">
              <Mail className="w-5 h-5 text-slate-400 opacity-70" />
              <span>{user.email}</span>
            </div>
            {sp.phone && (
              <div className="flex items-center gap-3 text-slate-300">
                <Phone className="w-5 h-5 text-slate-400 opacity-70" />
                <span>{sp.phone}</span>
              </div>
            )}
            {sp.currentLocation && (
              <div className="flex items-center gap-3 text-slate-300">
                <MapPin className="w-5 h-5 text-slate-400 opacity-70" />
                <span>{sp.currentLocation}</span>
              </div>
            )}
            {sp.university && (
              <div className="flex items-center gap-3 text-slate-300">
                <GraduationCap className="w-5 h-5 text-slate-400 opacity-70" />
                <span>{sp.university} - {sp.major}</span>
              </div>
            )}
          </div>
        )}

        {sp?.bio && (
          <div className="mt-6 p-4 rounded-xl bg-white/5">
            <h3 className="text-sm font-medium text-slate-300 mb-2">About</h3>
            <p className="text-sm text-slate-400">{sp.bio}</p>
          </div>
        )}
      </Card>

      {/* Skills */}
      {sp && sp.skills && sp.skills.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-slate-400 opacity-70" />
              Skills ({sp.skills.length})
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {sp.skills.map((skill: any) => (
              <Badge key={skill.id} variant="info">{skill.name} • {skill.level}</Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Education */}
      {sp && sp.education && sp.education.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-slate-400 opacity-70" />
              Education
            </h2>
          </div>
          <div className="space-y-4">
            {sp.education.map((edu: any) => (
              <div key={edu.id} className="flex items-start gap-4 p-4 rounded-xl bg-white/5">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-slate-400 opacity-70" />
                </div>
                <div>
                  <h3 className="font-medium text-white">{edu.institution}</h3>
                  <p className="text-sm text-slate-400">{edu.degree} in {edu.fieldOfStudy}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                    {edu.gpa && ` • GPA: ${edu.gpa}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Experience */}
      {sp && sp.experience && sp.experience.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-slate-400 opacity-70" />
              Experience
            </h2>
          </div>
          <div className="space-y-4">
            {sp.experience.map((exp: any) => (
              <div key={exp.id} className="flex items-start gap-4 p-4 rounded-xl bg-white/5">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-slate-400 opacity-70" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white">{exp.position}</h3>
                  <p className="text-sm text-slate-400">{exp.company} • {exp.location}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(exp.startDate).toLocaleDateString()} - {exp.isCurrent ? 'Present' : new Date(exp.endDate).toLocaleDateString()}
                  </p>
                  {exp.description && <p className="text-sm text-slate-300 mt-2">{exp.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Interests */}
      {sp && sp.interests && sp.interests.length > 0 && (
        <Card>
          <h2 className="text-lg font-medium text-white flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-slate-400 opacity-70" />
            Interests
          </h2>
          <div className="flex flex-wrap gap-2">
            {sp.interests.map((interest: any) => (
              <Badge key={interest.id} variant="outline">{interest.category}: {interest.value}</Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Saved Internships */}
      {sp && sp.savedInternships && sp.savedInternships.length > 0 && (
        <Card>
          <h2 className="text-lg font-medium text-white flex items-center gap-2 mb-4">
            <Save className="w-5 h-5 text-slate-400 opacity-70" />
            Saved Internships ({sp.savedInternships.length})
          </h2>
          <div className="space-y-2">
            {sp.savedInternships.map((saved: any) => (
              <Link key={saved.id} href={`/dashboard/internships/${saved.internshipId}`} className="block">
                <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                  <h4 className="text-sm font-medium text-white">{saved.internship?.title}</h4>
                  <p className="text-xs text-slate-400">{saved.internship?.employer?.companyName} • {saved.internship?.location}</p>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
