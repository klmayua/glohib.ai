'use client'

import Link from 'next/link'
import { Sparkles, Target, LineChart, Users, ArrowRight, Play, CheckCircle2 } from 'lucide-react'
import { useRef } from 'react'

export default function HomePage() {
  const featuresRef = useRef<HTMLDivElement>(null)

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-slate-950 animated-gradient noise-overlay relative overflow-hidden">
      {/* Background Elements - OPTIMIZED */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-[64px]" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-[64px]" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 anim-fade-in">
              <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">
                Glohib<span className="text-cyan-400">.ai</span>
              </span>
            </div>

            <div className="flex items-center gap-4 anim-fade-in">
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
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Hero Content */}
          <div className="text-center max-w-5xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-sm mb-8 anim-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-sm text-slate-300">AI-Powered Internship Matching</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight anim-fade-in-up anim-delay-1">
              Find Your Perfect
              <br />
              <span className="gradient-text">Career Launchpad</span>
            </h1>

            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed anim-fade-in-up anim-delay-2">
              Our advanced AI analyzes your skills, experience, and aspirations to match you
              with internships that accelerate your career growth.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 anim-fade-in-up anim-delay-3">
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
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-slate-500 text-sm anim-fade-in anim-delay-5">
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
            </div>
          </div>

          {/* Features Grid */}
          <div
            ref={featuresRef}
            className="grid md:grid-cols-3 gap-6 mb-20 anim-fade-in-up anim-delay-4"
          >
            <FeatureCard
              icon={Target}
              title="AI-Powered Matching"
              description="Our neural networks analyze thousands of data points to find internships that perfectly align with your skills and career goals."
            />
            <FeatureCard
              icon={LineChart}
              title="Smart Assessments"
              description="Showcase your abilities through AI-evaluated challenges, coding tests, and video interviews that highlight your true potential."
            />
            <FeatureCard
              icon={Users}
              title="Career Growth"
              description="Get matched with industry mentors, track your progress, and receive personalized recommendations for skill development."
            />
          </div>

          {/* Stats Section */}
          <div className="glass-card rounded-sm p-8 md:p-12 anim-fade-in-up anim-delay-6">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <StatCard number="10K+" label="Active Internships" />
              <StatCard number="500+" label="Partner Companies" />
              <StatCard number="50K+" label="Students Placed" />
              <StatCard number="95%" label="Success Rate" />
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center anim-fade-in-up anim-delay-8">
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
          </div>
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
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <div className="glass-card-hover rounded-2xl p-8 group">
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-7 h-7 text-cyan-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
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
