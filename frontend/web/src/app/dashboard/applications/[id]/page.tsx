'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Building2, MapPin, DollarSign, Clock, Calendar, FileText, CheckCircle, AlertCircle, XCircle, Loader } from 'lucide-react'
import { Card, Button, Badge } from '@/components/ui'
import Link from 'next/link'

const statusConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  DRAFT: { icon: FileText, color: 'text-slate-400', label: 'Draft' },
  SUBMITTED: { icon: CheckCircle, color: 'text-blue-400', label: 'Submitted' },
  UNDER_REVIEW: { icon: Loader, color: 'text-cyan-400', label: 'Under Review' },
  INTERVIEWING: { icon: Calendar, color: 'text-violet-400', label: 'Interviewing' },
  OFFERED: { icon: CheckCircle, color: 'text-green-400', label: 'Offered' },
  ACCEPTED: { icon: CheckCircle, color: 'text-emerald-400', label: 'Accepted' },
  REJECTED: { icon: XCircle, color: 'text-red-400', label: 'Rejected' },
  WITHDRAWN: { icon: AlertCircle, color: 'text-amber-400', label: 'Withdrawn' },
}

export default function ApplicationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [application, setApplication] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchApplication()
  }, [params.id])

  const fetchApplication = async () => {
    try {
      const res = await fetch('/api/applications', { credentials: 'include' })
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      const app = data.applications?.find((a: any) => a.id === params.id)
      if (!app) throw new Error('Not found')
      setApplication(app)
    } catch (err) {
      console.error('Application fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-12 text-slate-400">Loading application...</div>
  }

  if (!application) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-slate-600 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium text-white mb-2">Application not found</h3>
        <p className="text-slate-400 text-sm mb-6">This application may have been removed.</p>
        <Button onClick={() => router.push('/dashboard/applications')}>Back to Applications</Button>
      </div>
    )
  }

  const statusInfo = statusConfig[application.status] || statusConfig.DRAFT
  const StatusIcon = statusInfo.icon
  const internship = application.internship

  return (
    <div className="space-y-6">
      <Link href="/dashboard/applications">
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Applications
        </Button>
      </Link>

      {/* Status Header */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center border border-white/[0.08]">
              <Building2 className="w-8 h-8 text-slate-400 opacity-70" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white">{internship?.title || 'Internship'}</h1>
              <p className="text-slate-400">{internship?.employer?.companyName || internship?.employer?.user?.name || 'Company'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
            <Badge>{statusInfo.label}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-slate-500">Location</p>
            <p className="text-slate-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 opacity-70" /> {internship?.location || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-slate-500">Stipend</p>
            <p className="text-slate-300 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 opacity-70" /> {internship?.stipend ? `${internship.currency || 'USD'} ${internship.stipend.toLocaleString()}` : 'Unpaid'}
            </p>
          </div>
          <div>
            <p className="text-slate-500">Applied</p>
            <p className="text-slate-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 opacity-70" /> {application.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-slate-500">Last Updated</p>
            <p className="text-slate-300 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 opacity-70" /> {new Date(application.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </Card>

      {/* Timeline */}
      <Card>
        <h2 className="text-lg font-medium text-white mb-4">Application Timeline</h2>
        <div className="space-y-4">
          <TimelineItem icon={FileText} label="Application Submitted" date={application.submittedAt || application.createdAt} active={true} color="blue" />
          {['UNDER_REVIEW', 'INTERVIEWING', 'OFFERED', 'ACCEPTED', 'REJECTED'].includes(application.status) && (
            <TimelineItem icon={Loader} label="Under Review" date={application.reviewedAt} active={application.status === 'UNDER_REVIEW'} color="cyan" />
          )}
          {['INTERVIEWING', 'OFFERED', 'ACCEPTED'].includes(application.status) && (
            <TimelineItem icon={Calendar} label="Interview Stage" date={null} active={application.status === 'INTERVIEWING'} color="violet" />
          )}
          {application.status === 'OFFERED' && (
            <TimelineItem icon={CheckCircle} label="Offer Received" date={null} active={true} color="green" />
          )}
          {application.status === 'ACCEPTED' && (
            <TimelineItem icon={CheckCircle} label="Accepted" date={null} active={true} color="emerald" />
          )}
          {application.status === 'REJECTED' && (
            <TimelineItem icon={XCircle} label="Not Selected" date={application.reviewedAt} active={true} color="red" />
          )}
        </div>
      </Card>

      {/* Cover Letter */}
      {application.coverLetter && (
        <Card>
          <h2 className="text-lg font-medium text-white mb-4">Cover Letter</h2>
          <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{application.coverLetter}</p>
        </Card>
      )}

      {/* Internship Details */}
      {internship?.description && (
        <Card>
          <h2 className="text-lg font-medium text-white mb-4">About This Internship</h2>
          <p className="text-slate-300 leading-relaxed">{internship.description}</p>
          {internship.requirements && internship.requirements.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-white mb-2">Requirements</h3>
              <ul className="space-y-1">
                {internship.requirements.map((req: string, i: number) => (
                  <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                    <span className="text-sky-400 mt-0.5">•</span> {req}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={() => router.push('/dashboard/internships')}>Browse More Internships</Button>
        {application.status === 'SUBMITTED' && (
          <Button variant="secondary" disabled>Withdraw Application</Button>
        )}
      </div>
    </div>
  )
}

function TimelineItem({ icon: Icon, label, date, active, color }: {
  icon: React.ElementType; label: string; date: string | null; active: boolean; color: string
}) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-500/20 text-blue-400',
    cyan: 'bg-cyan-500/20 text-cyan-400',
    violet: 'bg-violet-500/20 text-violet-400',
    green: 'bg-green-500/20 text-green-400',
    emerald: 'bg-emerald-500/20 text-emerald-400',
    red: 'bg-red-500/20 text-red-400',
  }

  return (
    <div className="flex items-start gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color] || colors.blue} ${active ? '' : 'opacity-40'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className={`font-medium ${active ? 'text-white' : 'text-slate-500'}`}>{label}</p>
        {date && <p className="text-xs text-slate-500">{new Date(date).toLocaleDateString()}</p>}
      </div>
      {active && <Badge variant="info">Current</Badge>}
    </div>
  )
}
