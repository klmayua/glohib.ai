'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, CheckCircle2, XCircle, Mail } from 'lucide-react'

function VerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  const [status, setStatus] = useState<'pending' | 'verifying' | 'success' | 'error'>(
    token ? 'verifying' : 'pending'
  )
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) return

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify?token=${token}`)
        const data = await response.json()

        if (response.ok) {
          setStatus('success')
          setMessage(data.message || 'Your email has been verified successfully.')
        } else {
          setStatus('error')
          setMessage(data.error || 'Verification failed')
        }
      } catch (error) {
        setStatus('error')
        setMessage('An error occurred during verification')
      }
    }

    verifyEmail()
  }, [token])

  return (
    <div className="min-h-screen bg-slate-950 animated-gradient noise-overlay relative overflow-hidden flex items-center justify-center px-4">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-[64px]" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-[64px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 max-w-md w-full"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-sm bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">
              Glohib<span className="text-cyan-400">.ai</span>
            </span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card rounded-sm p-8 text-center"
        >
          {/* Pending - user just registered, hasn't clicked email link yet */}
          {status === 'pending' && (
            <>
              <div className="w-16 h-16 rounded-sm bg-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-cyan-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
              <p className="text-slate-400 mb-2">
                We&apos;ve sent a verification link to
              </p>
              {email && (
                <p className="text-cyan-400 font-medium mb-6">{email}</p>
              )}
              <p className="text-slate-500 text-sm mb-6">
                Click the link in the email to verify your account and start using Glohib.ai.
              </p>
              <Link
                href="/login"
                className="inline-block w-full glass-button py-3.5 rounded-sm font-semibold text-center"
              >
                Go to Login
              </Link>
            </>
          )}

          {/* Verifying */}
          {status === 'verifying' && (
            <>
              <div className="w-16 h-16 rounded-sm bg-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-2 border-white/30 border-t-cyan-400 rounded-full animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Verifying your email...</h1>
              <p className="text-slate-400">Please wait a moment.</p>
            </>
          )}

          {/* Success */}
          {status === 'success' && (
            <>
              <div className="w-16 h-16 rounded-sm bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Email Verified!</h1>
              <p className="text-slate-400 mb-6">{message}</p>
              <div className="space-y-3">
                <Link
                  href="/dashboard"
                  className="block w-full glass-button py-3.5 rounded-sm font-semibold text-center"
                >
                  Go to Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="block w-full glass-button-secondary py-3.5 rounded-sm font-semibold text-center"
                >
                  Complete Your Profile
                </Link>
              </div>
            </>
          )}

          {/* Error */}
          {status === 'error' && (
            <>
              <div className="w-16 h-16 rounded-sm bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Verification Failed</h1>
              <p className="text-slate-400 mb-6">{message}</p>
              <div className="space-y-3">
                <Link
                  href="/login"
                  className="block w-full glass-button py-3.5 rounded-sm font-semibold text-center"
                >
                  Back to Login
                </Link>
                <button
                  onClick={() => window.location.reload()}
                  className="block w-full glass-button-secondary py-3.5 rounded-sm font-semibold"
                >
                  Try Again
                </button>
              </div>
            </>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6"
        >
          <Link href="/" className="text-slate-500 hover:text-slate-300 transition-colors text-sm">
            ← Back to home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  )
}
