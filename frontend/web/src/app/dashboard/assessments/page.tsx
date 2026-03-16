'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const assessments = [
  {
    id: '1',
    title: 'Python Programming Assessment',
    duration: '60 minutes',
    questions: 25,
    difficulty: 'Intermediate',
    status: 'not_started',
  },
  {
    id: '2',
    title: 'Web Development Fundamentals',
    duration: '45 minutes',
    questions: 20,
    difficulty: 'Beginner',
    status: 'in_progress',
  },
  {
    id: '3',
    title: 'Data Structures & Algorithms',
    duration: '90 minutes',
    questions: 30,
    difficulty: 'Advanced',
    status: 'completed',
    score: '85%',
  },
]

export default function AssessmentsPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessments</h1>
          <p className="text-gray-600">
            Complete assessments to demonstrate your skills and improve your profile
          </p>
        </motion.div>

        {/* Assessments Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assessments.map((assessment, index) => (
            <motion.div
              key={assessment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{assessment.title}</h3>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    assessment.difficulty === 'Beginner'
                      ? 'bg-green-100 text-green-800'
                      : assessment.difficulty === 'Intermediate'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {assessment.difficulty}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Duration:</span>
                  <span>{assessment.duration}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Questions:</span>
                  <span>{assessment.questions}</span>
                </div>
                {assessment.status === 'completed' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Score:</span>
                    <span className="font-semibold text-green-600">{assessment.score}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    assessment.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : assessment.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {assessment.status.replace('_', ' ')}
                </span>

                {assessment.status !== 'completed' && (
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm">
                    {assessment.status === 'in_progress' ? 'Continue' : 'Start'}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Coming Soon Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-indigo-50 rounded-lg p-8 text-center"
        >
          <h2 className="text-xl font-semibold text-indigo-900 mb-2">More Assessments Coming Soon</h2>
          <p className="text-indigo-700">
            We're constantly adding new assessments to help you showcase your skills.
            Check back regularly for updates!
          </p>
        </motion.div>
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
        <NavLink href="/dashboard/assessments" icon="📝" label="Assessments" active />
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
