'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
import { internshipAPI } from '@/lib/api'
import { useAuthStore } from '@/lib/auth-store'
import { motion } from 'framer-motion'

export default function InternshipDetailPage() {
  const params = useParams()
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const [isApplying, setIsApplying] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ['internship', params.id],
    queryFn: () => internshipAPI.get(params.id as string),
  })

  const applyMutation = useMutation({
    mutationFn: (internshipId: string) =>
      internshipAPI.apply(internshipId, { student_id: user?.id }),
    onSuccess: () => {
      alert('Application submitted successfully!')
      setIsApplying(false)
    },
    onError: (error: any) => {
      alert('Failed to apply: ' + (error.response?.data?.error || 'Unknown error'))
      setIsApplying(false)
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Internship not found</h1>
          <Link href="/dashboard/internships" className="text-indigo-600 hover:underline">
            Back to internships
          </Link>
        </div>
      </div>
    )
  }

  const internship = data.data

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/dashboard/internships" className="text-indigo-600 hover:underline">
              ← Back to Internships
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {internship.title}
                </h1>
                <div className="flex flex-wrap gap-2">
                  {internship.remote && (
                    <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
                      Remote
                    </span>
                  )}
                  {internship.paid && (
                    <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                      Paid
                    </span>
                  )}
                  {internship.location && (
                    <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                      {internship.location}
                    </span>
                  )}
                  {internship.duration && (
                    <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full">
                      {internship.duration}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="prose max-w-none mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {internship.description}
              </p>
            </div>

            {internship.skills && internship.skills.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {internship.skills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="bg-indigo-100 text-indigo-700 text-sm px-3 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {internship.tags && internship.tags.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {internship.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-6 border-t">
              {isApplying ? (
                <button
                  disabled
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold opacity-50 cursor-not-allowed"
                >
                  Applying...
                </button>
              ) : (
                <button
                  onClick={() => setIsApplying(true)}
                  disabled={!user}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {user ? 'Apply Now' : 'Login to Apply'}
                </button>
              )}
              <Link
                href={`/dashboard/internships`}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </Link>
            </div>
          </div>

          {/* Application Status */}
          {user && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About This Internship</h2>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Posted</span>
                  <span className="text-gray-900">
                    {internship.created_at
                      ? new Date(internship.created_at).toLocaleDateString()
                      : 'Recently'}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Work Type</span>
                  <span className="text-gray-900">
                    {internship.remote ? 'Remote' : 'On-site'}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Compensation</span>
                  <span className="text-gray-900">
                    {internship.paid ? 'Paid' : 'Unpaid'}
                  </span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-600">Duration</span>
                  <span className="text-gray-900">
                    {internship.duration || 'Not specified'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
