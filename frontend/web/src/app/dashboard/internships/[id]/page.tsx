'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Building2, MapPin, DollarSign, Clock, Calendar, CheckCircle, Heart, CheckCircle2 } from 'lucide-react'
import { Card, Button, Badge, Skeleton } from '@/components/ui'
import Link from 'next/link'

export default function InternshipDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [internship, setInternship] = useState<any>(null)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchInternship()
    checkApplicationStatus()
  }, [params.id])

  const fetchInternship = async () => {
    try {
      const res = await fetch(`/api/internships/${params.id}`, { credentials: 'include' })
      if (!res.ok) throw new Error('Not found')
      const data = await res.json()
      setInternship(data.internship)
    } catch (err) {
      console.error('Internship fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const checkApplicationStatus = async () => {
    try {
      const res = await fetch('/api/applications', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        const hasApplied = data.applications?.some((a: any) => a.internshipId === params.id)
        setApplied(hasApplied)
      }
    } catch (err) {
      console.error('Application check error:', err)
    }
  }

  const handleApply = async () => {
    if (applied) return
    setApplying(true)
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ internshipId: params.id }),
      })
      if (res.ok) setApplied(true)
    } catch (err) {
      console.error('Apply error:', err)
    } finally {
      setApplying(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
      </div>
    )
  }

  if (!internship) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 mb-4">Internship not found</p>
        <Link href="/dashboard/internships">
          <Button>Back to Internships</Button>
        </Link>
      </div>
    )
  }

  const companyName = internship.employer?.companyName || internship.employer?.user?.name || 'Company'
  const locationTypeLabel: Record<string, string> = {
    ON_SITE: 'On-site',
    REMOTE: 'Remote',
    HYBRID: 'Hybrid',
  }

  return (
    <div className="space-y-6">
      <Link href="/dashboard/internships">
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Internships
        </Button>
      </Link>

      {/* Header */}
      <Card>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-white/[0.08]">
              <Building2 className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white mb-1">{internship.title}</h1>
              <p className="text-slate-400">{companyName}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-slate-400 mb-6">
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4 opacity-70" /> {internship.location}
          </span>
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 opacity-70" /> {locationTypeLabel[internship.locationType] || internship.locationType}
          </span>
          <span className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 opacity-70" /> {internship.stipend ? `${internship.currency || 'USD'} ${internship.stipend.toLocaleString()}` : 'Unpaid'}
          </span>
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4 opacity-70" /> {internship.duration} weeks
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 opacity-70" /> Posted {new Date(internship.publishedAt).toLocaleDateString()}
          </span>
        </div>

        {internship.applicationDeadline && (
          <div className="mb-6 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <p className="text-sm text-amber-400">
              ⏰ Application deadline: {new Date(internship.applicationDeadline).toLocaleDateString()}
            </p>
          </div>
        )}

        <div className="flex gap-3">
          {applied ? (
            <Button variant="secondary" disabled className="flex-1 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" /> Application Submitted
            </Button>
          ) : (
            <Button className="flex-1" onClick={handleApply} disabled={applying}>
              {applying ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </div>
              ) : 'Apply Now'}
            </Button>
          )}
          <Button variant="secondary" onClick={() => setSaved(!saved)} className={saved ? 'text-red-400' : ''}>
            <Heart className={`w-4 h-4 mr-2 ${saved ? 'fill-red-400 text-red-400' : ''}`} />
            {saved ? 'Saved' : 'Save'}
          </Button>
        </div>

        {applied && (
          <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-sm text-green-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Your application has been submitted! Track it in{' '}
              <Link href="/dashboard/applications" className="underline hover:text-green-300">
                My Applications
              </Link>.
            </p>
          </div>
        )}
      </Card>

      {/* Description */}
      {internship.description && (
        <Card>
          <h2 className="text-lg font-medium text-white mb-4">Description</h2>
          <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{internship.description}</p>
        </Card>
      )}

      {/* Requirements */}
      {internship.requirements && internship.requirements.length > 0 && (
        <Card>
          <h2 className="text-lg font-medium text-white mb-4">Requirements</h2>
          <ul className="space-y-2">
            {internship.requirements.map((req: string, index: number) => (
              <li key={index} className="flex items-start gap-3 text-slate-300">
                <span className="text-sky-400 mt-1">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Responsibilities */}
      {internship.responsibilities && internship.responsibilities.length > 0 && (
        <Card>
          <h2 className="text-lg font-medium text-white mb-4">Responsibilities</h2>
          <ul className="space-y-2">
            {internship.responsibilities.map((resp: string, index: number) => (
              <li key={index} className="flex items-start gap-3 text-slate-300">
                <span className="text-sky-400 mt-1">•</span>
                <span>{resp}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Benefits */}
      {internship.benefits && internship.benefits.length > 0 && (
        <Card>
          <h2 className="text-lg font-medium text-white mb-4">Benefits</h2>
          <ul className="space-y-2">
            {internship.benefits.map((benefit: string, index: number) => (
              <li key={index} className="flex items-start gap-3 text-slate-300">
                <span className="text-green-400 mt-1">✓</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Apply CTA */}
      {!applied && (
        <Card>
          <div className="text-center space-y-4">
            <h3 className="text-lg font-medium text-white">Ready to apply?</h3>
            <p className="text-slate-400 text-sm">Submit your application and take the first step towards your dream internship.</p>
            <Button className="w-full max-w-xs" onClick={handleApply} disabled={applying}>
              {applying ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
