'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Shield, User, Eye, Trash2, Save, CheckCircle } from 'lucide-react'
import { Card, Button } from '@/components/ui'
import { useLogout } from '@/hooks/use-auth'
import { useAuthStore } from '@/lib/auth-store'

export default function SettingsPage() {
  const router = useRouter()
  const logoutMutation = useLogout()
  const user = useAuthStore((state) => state.user)

  const [settings, setSettings] = useState({
    email: user?.email || '',
    role: user?.role || '',
    profileCompleteness: 0,
  })

  const [notifications, setNotifications] = useState({
    emailApplications: true,
    emailRecommendations: true,
    emailInterviews: true,
    emailMarketing: false,
  })

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEmail: false,
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setSettings(data.settings)
      }
    } catch (err) {
      console.error('Error fetching settings:', err)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ notifications, privacy }),
      })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
    } catch (err) {
      console.error('Error saving settings:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const togglePrivacy = (key: keyof typeof privacy) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Settings</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your account preferences</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : saveSuccess ? (<><CheckCircle className="w-4 h-4 mr-2" /> Saved</>) : (<><Save className="w-4 h-4 mr-2" /> Save All</>)}
        </Button>
      </div>

      {/* Account */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <User className="w-5 h-5 text-sky-400" />
          <h2 className="font-medium text-white">Account</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-white/[0.08]">
            <div>
              <p className="text-sm text-white">Email</p>
              <p className="text-xs text-slate-400">{settings.email}</p>
            </div>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-white/[0.08]">
            <div>
              <p className="text-sm text-white">Role</p>
              <p className="text-xs text-slate-400">{settings.role}</p>
            </div>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-white/[0.08]">
            <div>
              <p className="text-sm text-white">Profile Completeness</p>
              <p className="text-xs text-slate-400">{settings.profileCompleteness}%</p>
            </div>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm text-white">Profile</p>
              <p className="text-xs text-slate-400">Edit your public profile information</p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => router.push('/dashboard/profile/edit')}>
              Edit
            </Button>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-sky-400" />
          <h2 className="font-medium text-white">Notifications</h2>
        </div>
        <div className="space-y-4">
          {([
            { key: 'emailApplications' as const, label: 'Application updates', desc: 'Status changes on your applications' },
            { key: 'emailRecommendations' as const, label: 'New recommendations', desc: 'AI-matched internship suggestions' },
            { key: 'emailInterviews' as const, label: 'Interview reminders', desc: 'Upcoming interview notifications' },
            { key: 'emailMarketing' as const, label: 'Product updates', desc: 'New features and announcements' },
          ]).map((item) => (
            <div key={item.key} className="flex items-center justify-between py-3 border-b border-white/[0.08] last:border-0">
              <div>
                <p className="text-sm text-white">{item.label}</p>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
              <button
                onClick={() => toggleNotification(item.key)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                  notifications[item.key] ? 'bg-sky-500' : 'bg-white/10'
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                  notifications[item.key] ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Privacy */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Eye className="w-5 h-5 text-sky-400" />
          <h2 className="font-medium text-white">Privacy</h2>
        </div>
        <div className="space-y-4">
          {([
            { key: 'profileVisible' as const, label: 'Profile visible to employers', desc: 'Allow employers to discover your profile' },
            { key: 'showEmail' as const, label: 'Show email on profile', desc: 'Display your email address publicly' },
          ]).map((item) => (
            <div key={item.key} className="flex items-center justify-between py-3 border-b border-white/[0.08] last:border-0">
              <div>
                <p className="text-sm text-white">{item.label}</p>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
              <button
                onClick={() => togglePrivacy(item.key)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                  privacy[item.key] ? 'bg-sky-500' : 'bg-white/10'
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                  privacy[item.key] ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Danger Zone */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-red-400" />
          <h2 className="font-medium text-white">Danger Zone</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-white/[0.08]">
            <div>
              <p className="text-sm text-white">Sign out</p>
              <p className="text-xs text-slate-400">Sign out of your account on this device</p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => logoutMutation.mutate()} disabled={logoutMutation.isPending}>
              {logoutMutation.isPending ? 'Signing out...' : 'Sign Out'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
