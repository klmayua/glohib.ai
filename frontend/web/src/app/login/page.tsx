'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLogin } from '@/hooks/use-auth'
import { signIn } from 'next-auth/react'
import { Sparkles, Mail, Lock, ArrowRight, Github, Chrome } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const loginMutation = useLogin()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await loginMutation.mutateAsync(formData)
      // Navigation happens in the hook's onSuccess
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
    }
  }

  // Clear error when user starts typing
  const handleInputChange = () => {
    if (error) setError('')
  }

  return (
    <div className="min-h-screen bg-slate-950 animated-gradient noise-overlay relative overflow-hidden flex items-center justify-center px-4">
      {/* Background Elements - OPTIMIZED */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full" />

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

        {/* Login Card */}
        <div className="glass-card rounded-sm p-8 anim-fade-in-up anim-delay-2">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-slate-400">Sign in to continue your journey</p>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="glass-button-secondary py-2.5 rounded-sm flex items-center justify-center gap-2 text-sm"
            >
              <Chrome className="w-5 h-5" />
              Google
            </button>
            <button
              type="button"
              onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
              className="glass-button-secondary py-2.5 rounded-sm flex items-center justify-center gap-2 text-sm"
            >
              <Github className="w-5 h-5" />
              GitHub
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-900/50 text-slate-500">Or continue with</span>
            </div>
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
                  required
                  disabled={loginMutation.isPending}
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value })
                    handleInputChange()
                  }}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all disabled:opacity-50"
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
                  disabled={loginMutation.isPending}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value })
                    handleInputChange()
                  }}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all disabled:opacity-50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input type="checkbox" className="rounded bg-white/5 border-white/10 text-cyan-500 focus:ring-cyan-500/50" />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full glass-button py-3.5 rounded-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loginMutation.isPending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-slate-400 mt-6 text-sm">
            Don't have an account?{' '}
            <Link href="/register" className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">
              Create one
            </Link>
          </p>
        </div>

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
