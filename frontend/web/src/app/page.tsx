'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-indigo-600"
          >
            Glohib.ai
          </motion.h1>
          <div className="space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Link 
              href="/register" 
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-6xl font-bold text-gray-900 mb-6">
            Find Your Perfect Internship
            <span className="text-indigo-600"> Powered by AI</span>
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Glohib.ai uses advanced AI to match you with internships that fit your skills, 
            interests, and career goals. Get personalized recommendations and track your application progress.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/register" 
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition"
            >
              Start Your Journey
            </Link>
            <Link 
              href="/login" 
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition"
            >
              Sign In
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20 grid md:grid-cols-3 gap-8"
        >
          <FeatureCard
            icon="🎯"
            title="AI-Powered Matching"
            description="Our advanced algorithms analyze your profile to find perfect internship matches"
          />
          <FeatureCard
            icon="📊"
            title="Smart Assessments"
            description="Showcase your skills through AI-evaluated challenges and video interviews"
          />
          <FeatureCard
            icon="🚀"
            title="Career Growth"
            description="Get matched with mentors and track your progress toward your dream career"
          />
        </motion.div>
      </main>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
