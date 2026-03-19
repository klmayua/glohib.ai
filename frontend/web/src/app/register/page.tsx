'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRegister } from '@/hooks/use-auth'
import { Sparkles, Mail, Lock, ArrowRight, CheckCircle2, Briefcase, GraduationCap, Users } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const registerMutation = useRegister()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  })
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    registerMutation.mutate(
      { email: formData.email, password: formData.password, role: formData.role },
      {
        onSuccess: () => {
          setSuccess(true)
          setTimeout(() => {
            router.push(`/verify?email=${encodeURIComponent(formData.email)}`)
          }, 2000)
        },
        onError: (err: any) => {
          setError(err.response?.data?.error || err.message || 'Registration failed. Please try again.')
        },
      }
    )
  }

  const roles = [
    { id: 'student', label: 'Student', icon: GraduationCap, desc: 'Looking for internships' },
    { id: 'employer', label: 'Employer', icon: Briefcase, desc: 'Hiring talent' },
    { id: 'mentor', label: 'Mentor', icon: Users, desc: 'Guiding careers' },
  ]

  return (
    <div className="min-h-screen bg-slate-950 animated-gradient noise-overlay relative overflow-hidden flex items-center justify-center px-4 py-12">
      {/* Background Elements */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full" />

      <div className="relative z-10 max-w-md w-full anim-fade-in-scale">
        {/* Logo */}
        <div className="text-center mb-8 anim-fade-in-down anim-delay-1">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-sm bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">
              Glohib<span className="text-cyan-400">.ai</span>
            </span>
          </Link>
        </div>

        {success ? (
          <div className="glass-card rounded-sm p-8 text-center anim-fade-in-scale">
            <div className="w-16 h-16 rounded-sm bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
            <p className="text-slate-400 mb-4">Please check your email to verify your account.</p>
            <Link href={`/verify?email=${encodeURIComponent(formData.email)}`} className="text-cyan-400 hover:text-cyan-300">
              Click here if not redirected
            </Link>
          </div>
        ) : (
          <div className="glass-card rounded-sm p-8 anim-fade-in-up anim-delay-2">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
              <p className="text-slate-400">Start your career journey today</p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className={`w-8 h-8 rounded-sm flex items-center justify-center text-sm font-semibold ${
                step >= 1 ? 'bg-cyan-500 text-white' : 'bg-white/10 text-slate-400'
              }`}>
                1
              </div>
              <div className="w-12 h-0.5 bg-white/10" />
              <div className={`w-8 h-8 rounded-sm flex items-center justify-center text-sm font-semibold ${
                step >= 2 ? 'bg-cyan-500 text-white' : 'bg-white/10 text-slate-400'
              }`}>
                2
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-sm mb-6 text-sm anim-fade-in-up">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {step === 1 && (
                <div className="space-y-4 anim-fade-in-up">
                  <p className="text-slate-300 text-sm mb-4">Select your role:</p>
                  <div className="space-y-3">
                    {roles.map((role) => {
                      const Icon = role.icon
                      return (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, role: role.id })
                            setStep(2)
                          }}
                          className={`w-full p-4 rounded-sm border transition-all duration-300 flex items-center gap-4 ${
                            formData.role === role.id
                              ? 'bg-cyan-500/20 border-cyan-500/50'
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-sm flex items-center justify-center ${
                            formData.role === role.id
                              ? 'bg-cyan-500 text-white'
                              : 'bg-white/10 text-slate-400'
                          }`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-white">{role.label}</div>
                            <div className="text-sm text-slate-400">{role.desc}</div>
                          </div>
                          {formData.role === role.id && (
                            <CheckCircle2 className="w-5 h-5 text-cyan-400 ml-auto" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5 anim-fade-in-up">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        id="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Must be at least 8 characters</p>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        id="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 glass-button-secondary py-3.5 font-semibold"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={registerMutation.isPending}
                      className="flex-1 glass-button py-3.5 font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {registerMutation.isPending ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>

            <p className="text-center text-slate-400 mt-6 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">
                Sign in
              </Link>
            </p>

            <div className="mt-6 text-center">
              <p className="text-xs text-slate-500">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="text-cyan-400 hover:underline">Terms</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-cyan-400 hover:underline">Privacy Policy</Link>
              </p>
            </div>
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-6 anim-fade-in anim-delay-6">
          <Link href="/" className="text-slate-500 hover:text-slate-300 transition-colors text-sm">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
