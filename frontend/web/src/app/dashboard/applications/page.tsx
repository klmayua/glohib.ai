'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FileText, Briefcase, ArrowRight, Building2, MapPin, DollarSign } from 'lucide-react'
import { Card, Button, Badge } from '@/components/ui'
import { useDashboardStore } from '@/store/zustandStore'

export default function ApplicationsPage() {
  const router = useRouter()
  const { applications, setApplications } = useDashboardStore()

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/applications', { credentials: 'include' })
      const data = await res.json()
      setApplications(data.applications || [])
    } catch (error) {
      console.error('Error fetching applications:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">My Applications</h1>
          <p className="text-slate-400 text-sm mt-1">Track and manage your internship applications</p>
        </div>
        <Button onClick={() => router.push('/dashboard/internships')}>
          Find More Internships
        </Button>
      </div>

      {applications.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-white mb-2">No applications yet</h3>
            <p className="text-slate-400 text-sm mb-6">
              Start applying to internships to track your progress here.
            </p>
            <Button onClick={() => router.push('/dashboard/internships')}>
              Browse Internships
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((app: any) => (
            <Link key={app.id} href={`/dashboard/applications/${app.id}`}>
              <Card hover className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/[0.08]">
                    <Building2 className="w-6 h-6 text-slate-400 opacity-70" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{app.internship.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      <span>{app.internship.employer.companyName}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 opacity-70" />
                        {app.internship.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge>{app.status}</Badge>
                  <ArrowRight className="w-5 h-5 text-slate-400" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
