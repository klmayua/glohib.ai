'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Phone, MapPin, GraduationCap, Briefcase, Star, Save } from 'lucide-react'
import { Card, Button, Input, Badge } from '@/components/ui'
import { useDashboardStore } from '@/store/zustandStore'

export default function ProfilePage() {
  const router = useRouter()
  const { user } = useDashboardStore()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">My Profile</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your personal information and preferences</p>
      </div>

      {/* Profile Overview */}
      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-xl bg-white/[0.08] flex items-center justify-center text-white text-2xl font-semibold">
            {user?.email?.[0]?.toUpperCase() || 'S'}
          </div>
          <div>
            <h2 className="text-xl font-medium text-white">{user?.name || 'Student User'}</h2>
            <p className="text-slate-400">{user?.email || 'student@example.com'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 text-slate-300">
            <Mail className="w-5 h-5 text-slate-400 opacity-70" />
            <span>{user?.email || 'student@example.com'}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <Phone className="w-5 h-5 text-slate-400 opacity-70" />
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <MapPin className="w-5 h-5 text-slate-400 opacity-70" />
            <span>San Francisco, CA</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <GraduationCap className="w-5 h-5 text-slate-400 opacity-70" />
            <span>University of California</span>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button>Edit Profile</Button>
          <Button variant="secondary">Upload Resume</Button>
        </div>
      </Card>

      {/* Skills */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-slate-400 opacity-70" />
            Skills
          </h2>
          <Button variant="ghost" size="sm">Add Skill</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge>Product Management</Badge>
          <Badge>Data Analysis</Badge>
          <Badge>Python</Badge>
          <Badge>SQL</Badge>
          <Badge>Machine Learning</Badge>
          <Badge>Communication</Badge>
        </div>
      </Card>

      {/* Experience */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-slate-400 opacity-70" />
            Experience
          </h2>
          <Button variant="ghost" size="sm">Add Experience</Button>
        </div>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/[0.08]">
              <Briefcase className="w-5 h-5 text-slate-400 opacity-70" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white">Product Intern</h3>
              <p className="text-sm text-slate-400">Tech Company • Jun 2024 - Aug 2024</p>
              <p className="text-sm text-slate-300 mt-2">
                Worked with senior PMs to define product requirements and conduct user research.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Saved Internships */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-white flex items-center gap-2">
            <Save className="w-5 h-5 text-slate-400 opacity-70" />
            Saved Internships
          </h2>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        <p className="text-slate-400 text-sm">
          You haven't saved any internships yet.
        </p>
      </Card>

      {/* Settings */}
      <Card>
        <h2 className="text-lg font-medium text-white mb-4">Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium text-sm">Email Notifications</p>
              <p className="text-slate-400 text-xs">Receive updates about your applications</p>
            </div>
            <Button variant="secondary" size="sm">Enabled</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium text-sm">Profile Visibility</p>
              <p className="text-slate-400 text-xs">Make your profile visible to employers</p>
            </div>
            <Button variant="secondary" size="sm">Public</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
