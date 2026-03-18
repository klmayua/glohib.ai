'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Sparkles } from 'lucide-react'

function OAuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      setError('Authentication failed. Please try again.')
    } else {
      // Success - redirect to onboarding or dashboard
      router.push('/dashboard')
    }
  }, [searchParams, router])

  return (
    <div className="text-center">
      {error ? (
        <>
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Authentication Failed</h1>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => router.push('/auth')}
            className="glass-button px-6 py-3 rounded-sm"
          >
            Try Again
          </button>
        </>
      ) : (
        <>
          <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Completing Sign In...</h1>
          <p className="text-slate-400">Please wait while we set up your account</p>
        </>
      )}
    </div>
  )
}

export default function OAuthCallbackPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <Suspense fallback={
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Loading...</h1>
        </div>
      }>
        <OAuthCallbackContent />
      </Suspense>
    </div>
  )
}
