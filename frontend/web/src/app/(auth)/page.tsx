'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Briefcase, GraduationCap, Users, Mail, Lock } from 'lucide-react'

export default function AuthPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [isEmailAuth, setIsEmailAuth] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })

  const roles = [
    { 
      id: 'student', 
      label: 'Student', 
      icon: GraduationCap, 
      desc: 'Looking for internships',
      tagline: 'Launch Your Career',
      color: 'from-cyan-400 to-blue-500'
    },
    { 
      id: 'employer', 
      label: 'Employer', 
      icon: Briefcase, 
      desc: 'Hiring top talent',
      tagline: 'Hire Top Talent',
      color: 'from-purple-400 to-pink-500'
    },
    { 
      id: 'mentor', 
      label: 'Mentor', 
      icon: Users, 
      desc: 'Guiding future leaders',
      tagline: 'Shape Future Leaders',
      color: 'from-amber-400 to-orange-500'
    },
  ]

  const handleOAuthSignIn = async (provider: string) => {
    try {
      await signIn(provider, { 
        callbackUrl: selectedRole ? `/onboarding/${selectedRole}` : '/dashboard'
      })
    } catch (error) {
      console.error('OAuth error:', error)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Email auth will be implemented in P1-004
    console.log('Email auth:', formData)
  }

  return (
    <div className="min-h-screen bg-slate-950 animated-gradient noise-overlay relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px]" />

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-sm bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">
              Glohib<span className="text-cyan-400">.ai</span>
            </span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-8 mb-4">
            Welcome to the Future of<br />
            <span className="gradient-text">Career Matching</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            AI-powered platform connecting students, employers, and mentors worldwide
          </p>
        </motion.div>

        {/* Role Selection */}
        {!selectedRole ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              How would you like to use Glohib?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {roles.map((role, index) => (
                <motion.button
                  key={role.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedRole(role.id)}
                  className="group glass-card-hover rounded-2xl p-8 text-left transition-all duration-300 hover:scale-105"
                >
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <role.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{role.label}</h3>
                  <p className="text-slate-400 mb-4">{role.desc}</p>
                  <p className="text-sm text-cyan-400 font-semibold">{role.tagline}</p>
                  <ArrowRight className="w-5 h-5 text-slate-500 mt-4 group-hover:translate-x-2 transition-transform" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          /* OAuth + Email Auth */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <div className="glass-card rounded-2xl p-8">
              <button
                onClick={() => setSelectedRole(null)}
                className="text-slate-400 hover:text-white mb-6 text-sm"
              >
                ← Back to roles
              </button>

              <h2 className="text-2xl font-bold text-white mb-2">
                Create your account
              </h2>
              <p className="text-slate-400 mb-8">
                Join as a {selectedRole}
              </p>

              {/* OAuth Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handleOAuthSignIn('linkedin')}
                  className="w-full glass-button-secondary py-3 rounded-sm flex items-center justify-center gap-3 hover:bg-[#0077b5]/10 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  Continue with LinkedIn
                </button>
                <button
                  onClick={() => handleOAuthSignIn('google')}
                  className="w-full glass-button-secondary py-3 rounded-sm flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
                <button
                  onClick={() => handleOAuthSignIn('github')}
                  className="w-full glass-button-secondary py-3 rounded-sm flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  Continue with GitHub
                </button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-900 text-slate-500">Or</span>
                </div>
              </div>

              {!isEmailAuth ? (
                <button
                  onClick={() => setIsEmailAuth(true)}
                  className="w-full glass-button-secondary py-3 rounded-sm flex items-center justify-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  Use email instead
                </button>
              ) : (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      required
                      minLength={8}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full glass-button py-3 rounded-sm font-semibold"
                  >
                    Create account
                  </button>
                </form>
              )}

              <p className="text-center text-slate-400 text-sm mt-6">
                Already have an account?{' '}
                <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        )}

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto mt-20 text-center"
        >
          <div className="flex flex-wrap justify-center gap-8 text-slate-500 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>10,000+ Active Internships</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>500+ Partner Companies</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>98% Satisfaction Rate</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
