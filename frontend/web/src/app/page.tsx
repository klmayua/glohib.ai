'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, Target, LineChart, Users, ArrowRight, Play, CheckCircle2 } from 'lucide-react'
import { useRef } from 'react'

export default function HomePage() {
  const featuresRef = useRef<HTMLDivElement>(null)

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-slate-950 animated-gradient noise-overlay relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px]" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">
                Glohib<span className="text-cyan-400">.ai</span>
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <Link
                href="/login"
                className="glass-button-secondary px-6 py-2.5 text-sm inline-flex items-center gap-2"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="glass-button px-6 py-2.5 text-sm inline-flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Hero Content */}
          <div className="text-center max-w-5xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-sm mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-sm text-slate-300">AI-Powered Internship Matching</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight"
            >
              Find Your Perfect
              <br />
              <span className="gradient-text">Career Launchpad</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Our advanced AI analyzes your skills, experience, and aspirations to match you
              with internships that accelerate your career growth.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link
                href="/register"
                className="glass-button px-8 py-4 text-lg inline-flex items-center justify-center gap-2 group"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={scrollToFeatures}
                className="glass-button-secondary px-8 py-4 text-lg inline-flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12 flex flex-wrap justify-center gap-8 text-slate-500 text-sm"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>10,000+ Matches Made</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>500+ Partner Companies</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>98% Satisfaction Rate</span>
              </div>
            </motion.div>
          </div>

          {/* Features Grid */}
          <motion.div
            ref={featuresRef}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid md:grid-cols-3 gap-6 mb-20"
          >
            <FeatureCard
              icon={Target}
              title="AI-Powered Matching"
              description="Our neural networks analyze thousands of data points to find internships that perfectly align with your skills and career goals."
              delay={0}
            />
            <FeatureCard
              icon={LineChart}
              title="Smart Assessments"
              description="Showcase your abilities through AI-evaluated challenges, coding tests, and video interviews that highlight your true potential."
              delay={0.1}
            />
            <FeatureCard
              icon={Users}
              title="Career Growth"
              description="Get matched with industry mentors, track your progress, and receive personalized recommendations for skill development."
              delay={0.2}
            />
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="glass-card rounded-sm p-8 md:p-12"
          >
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <StatCard number="10K+" label="Active Internships" />
              <StatCard number="500+" label="Partner Companies" />
              <StatCard number="50K+" label="Students Placed" />
              <StatCard number="95%" label="Success Rate" />
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-20 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Launch Your Career?
            </h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Join thousands of students who have found their dream internships through Glohib.ai
            </p>
            <Link
              href="/register"
              className="glass-button px-10 py-4 text-lg inline-flex items-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-6 text-center text-slate-500 text-sm">
          <p>&copy; 2026 Glohib.ai. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: React.ElementType
  title: string
  description: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 + delay }}
      className="glass-card-hover rounded-2xl p-8 group"
    >
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-7 h-7 text-cyan-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </motion.div>
  )
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="space-y-2">
      <div className="text-4xl md:text-5xl font-bold gradient-text">{number}</div>
      <div className="text-slate-400 text-sm">{label}</div>
    </div>
  )
}
