'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
      } else {
        setError(data.error || 'Failed to send reset email')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 animated-gradient noise-overlay relative overflow-hidden flex items-center justify-center px-4">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-[64px]" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-[64px]" />

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

        <div className="glass-card rounded-sm p-8 anim-fade-in-up anim-delay-2">
          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-sm bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
              <p className="text-slate-400 mb-2">
                We&apos;ve sent a password reset link to
              </p>
              <p className="text-cyan-400 font-medium mb-6">{email}</p>
              <p className="text-slate-500 text-sm mb-6">
                Didn&apos;t receive the email? Check your spam folder or{' '}
                <button onClick={() => setSuccess(false)} className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  try again
                </button>
              </p>
              <Link
                href="/login"
                className="inline-block w-full glass-button py-3.5 rounded-sm font-semibold text-center"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Forgot Password?</h1>
                <p className="text-slate-400">No worries! We&apos;ll send you reset instructions.</p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-sm mb-6 text-sm anim-fade-in-up">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all disabled:opacity-50"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full glass-button py-3.5 rounded-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            </>
          )}

          <p className="text-center text-slate-400 mt-6 text-sm">
            Remember your password?{' '}
            <Link href="/login" className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        <div className="text-center mt-6 anim-fade-in anim-delay-6">
          <Link href="/" className="text-slate-500 hover:text-slate-300 transition-colors text-sm">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
