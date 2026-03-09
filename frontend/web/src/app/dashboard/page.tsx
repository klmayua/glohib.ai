'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/auth-store'
import { useCurrentUser, useLogout } from '@/hooks/use-auth'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const { logout } = useLogout()
  const { data, isLoading, error } = useCurrentUser()

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error || !isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/dashboard" className="text-2xl font-bold text-indigo-600">
              Glohib.ai
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/dashboard/internships" className="text-gray-600 hover:text-gray-900">
                Find Internships
              </Link>
              <Link href="/dashboard/profile" className="text-gray-600 hover:text-gray-900">
                Profile
              </Link>
              <button
                onClick={() => logout()}
                className="text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your internship search
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Applications"
            value="0"
            description="Total applications submitted"
            icon="📝"
          />
          <StatCard
            title="Interviews"
            value="0"
            description="Upcoming interviews"
            icon="🎤"
          />
          <StatCard
            title="Matches"
            value="--"
            description="AI-powered matches"
            icon="🎯"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/dashboard/internships"
                className="block bg-indigo-50 text-indigo-700 p-4 rounded-lg hover:bg-indigo-100 transition"
              >
                🔍 Browse Internships
              </Link>
              <Link
                href="/dashboard/profile"
                className="block bg-indigo-50 text-indigo-700 p-4 rounded-lg hover:bg-indigo-100 transition"
              >
                👤 Complete Your Profile
              </Link>
              <Link
                href="/dashboard/assessments"
                className="block bg-indigo-50 text-indigo-700 p-4 rounded-lg hover:bg-indigo-100 transition"
              >
                📊 Take Assessments
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            <p className="text-gray-600">No recent activity</p>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({ title, value, description, icon }: { title: string; value: string; description: string; icon: string }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl">{icon}</span>
        <span className="text-4xl font-bold text-indigo-600">{value}</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  )
}
