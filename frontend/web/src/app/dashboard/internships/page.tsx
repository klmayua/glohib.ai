'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { internshipAPI, recommendationAPI } from '@/lib/api'
import { useAuthStore } from '@/lib/auth-store'
import { motion } from 'framer-motion'

export default function InternshipsPage() {
  const user = useAuthStore((state) => state.user)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState({
    remote: false,
    paid: false,
  })

  const { data: internshipsData, isLoading } = useQuery({
    queryKey: ['internships'],
    queryFn: () => internshipAPI.list(50, 0),
  })

  const { data: recommendationsData } = useQuery({
    queryKey: ['recommendations', user?.id],
    queryFn: () => recommendationAPI.recommend(user?.id || '', 20),
    enabled: !!user?.id,
  })

  const applyMutation = useMutation({
    mutationFn: (internshipId: string) => internshipAPI.apply(internshipId, {}),
  })

  const internships = internshipsData?.data?.internships || []
  const recommendations = recommendationsData?.data?.recommendations || []

  const handleApply = (internshipId: string) => {
    applyMutation.mutate(internshipId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/dashboard" className="text-2xl font-bold text-indigo-600">
              Glohib.ai
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Dream Internship
          </h1>
          
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                placeholder="Search internships..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
                Search
              </button>
            </div>
            
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filter.remote}
                  onChange={(e) => setFilter({ ...filter, remote: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-gray-700">Remote Only</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filter.paid}
                  onChange={(e) => setFilter({ ...filter, paid: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-gray-700">Paid Only</span>
              </label>
            </div>
          </div>
        </motion.div>

        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🎯 Recommended for You
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.slice(0, 6).map((rec: any, index: number) => (
                <InternshipCard
                  key={rec.internship_id}
                  internship={rec}
                  onApply={() => handleApply(rec.internship_id)}
                  isRecommended
                  matchScore={rec.score}
                />
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            All Internships
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {internships.map((internship: any) => (
                <InternshipCard
                  key={internship.id}
                  internship={internship}
                  onApply={() => handleApply(internship.id)}
                />
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}

function InternshipCard({ internship, onApply, isRecommended = false, matchScore = 0 }: any) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
    >
      {isRecommended && (
        <div className="mb-3">
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
            {Math.round(matchScore * 100)}% Match
          </span>
        </div>
      )}
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {internship.title || 'Internship Position'}
      </h3>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {internship.remote && (
          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">Remote</span>
        )}
        {internship.paid && (
          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">Paid</span>
        )}
        {internship.location && (
          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
            {internship.location}
          </span>
        )}
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {internship.description || 'No description available'}
      </p>
      
      <div className="flex gap-2">
        <button
          onClick={onApply}
          className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Apply Now
        </button>
        <Link
          href={`/dashboard/internships/${internship.id}`}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          Details
        </Link>
      </div>
    </motion.div>
  )
}
