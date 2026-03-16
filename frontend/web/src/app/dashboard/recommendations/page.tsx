'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

// Mock data - replace with actual API calls
const mockRecommendations = [
  {
    id: '1',
    title: 'Software Engineering Intern',
    company: 'Tech Corp',
    location: 'San Francisco, CA (Remote)',
    type: 'Software Engineering',
    matchScore: 95,
    postedDate: '2 days ago',
    description: 'Work on cutting-edge projects with our engineering team.',
    requiredSkills: ['Python', 'JavaScript', 'React'],
  },
  {
    id: '2',
    title: 'Machine Learning Intern',
    company: 'AI Innovations',
    location: 'Remote',
    type: 'Data Science',
    matchScore: 92,
    postedDate: '1 week ago',
    description: 'Join our ML team to build next-generation AI solutions.',
    requiredSkills: ['Python', 'TensorFlow', 'Machine Learning'],
  },
  {
    id: '3',
    title: 'Frontend Development Intern',
    company: 'Design Studio',
    location: 'New York, NY (Hybrid)',
    type: 'Frontend Development',
    matchScore: 88,
    postedDate: '3 days ago',
    description: 'Create beautiful user interfaces for our clients.',
    requiredSkills: ['React', 'TypeScript', 'CSS'],
  },
  {
    id: '4',
    title: 'Backend Engineering Intern',
    company: 'StartupXYZ',
    location: 'Remote',
    type: 'Backend Development',
    matchScore: 85,
    postedDate: '5 days ago',
    description: 'Build scalable backend systems and APIs.',
    requiredSkills: ['Python', 'PostgreSQL', 'Redis'],
  },
]

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState(mockRecommendations)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading - replace with actual API call
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your personalized recommendations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Recommended Internships for You
          </h1>
          <p className="text-gray-600">
            AI-powered recommendations based on your skills and preferences
          </p>
        </motion.div>

        {/* Recommendations List */}
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{rec.title}</h3>
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded">
                      {rec.type}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-2">{rec.company}</p>
                  <p className="text-sm text-gray-500 mb-3">{rec.location}</p>

                  <p className="text-gray-700 mb-3">{rec.description}</p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {rec.requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Posted {rec.postedDate}</span>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-center">
                  <div className="text-center mb-3">
                    <div className="text-3xl font-bold text-green-600">{rec.matchScore}%</div>
                    <div className="text-xs text-gray-500">match</div>
                  </div>

                  <button className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                    Apply Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLoading(true)}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Refresh Recommendations
          </button>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  )
}

function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
      <div className="grid grid-cols-4 gap-1">
        <NavLink href="/dashboard" icon="🏠" label="Home" />
        <NavLink href="/dashboard/internships" icon="💼" label="Internships" />
        <NavLink href="/dashboard/recommendations" icon="✨" label="Recommendations" active />
        <NavLink href="/dashboard/profile" icon="👤" label="Profile" />
      </div>
    </nav>
  )
}

function NavLink({
  href,
  icon,
  label,
  active = false,
}: {
  href: string
  icon: string
  label: string
  active?: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center py-3 px-2 ${
        active ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      <span className="text-xl mb-1">{icon}</span>
      <span className="text-xs">{label}</span>
    </Link>
  )
}
