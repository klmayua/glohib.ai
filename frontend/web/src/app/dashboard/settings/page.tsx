'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Shield, User, Eye, Trash2 } from 'lucide-react'
import { Card, Button } from '@/components/ui'
import { useLogout } from '@/hooks/use-auth'
import { useAuthStore } from '@/lib/auth-store'

export default function SettingsPage() {
  const router = useRouter()
  const logoutMutation = useLogout()
  const user = useAuthStore((state) => state.user)

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

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const togglePrivacy = (key: keyof typeof privacy) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account preferences</p>
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
              <p className="text-xs text-slate-400">{user?.email || 'Not set'}</p>
            </div>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-white/[0.08]">
            <div>
              <p className="text-sm text-white">Password</p>
              <p className="text-xs text-slate-400">Last changed: Unknown</p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => router.push('/forgot-password')}>
              Change
            </Button>
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
            <Button
              variant="secondary"
              size="sm"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? 'Signing out...' : 'Sign Out'}
            </Button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm text-red-400">Delete account</p>
              <p className="text-xs text-slate-400">Permanently delete your account and all data</p>
            </div>
            <Button variant="danger" size="sm">
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Delete
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
