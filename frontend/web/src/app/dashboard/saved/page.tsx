'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, Building2, MapPin, DollarSign, ArrowRight } from 'lucide-react'
import { Card, Button, Badge, Skeleton } from '@/components/ui'
import Link from 'next/link'

export default function SavedPage() {
  const router = useRouter()
  const [internships, setInternships] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSaved()
  }, [])

  const fetchSaved = async () => {
    try {
      const res = await fetch('/api/profile', { credentials: 'include' })
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      const saved = data.user?.studentProfile?.savedInternships || []
      setInternships(saved.map((s: any) => s.internship).filter(Boolean))
    } catch (err) {
      console.error('Saved fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Saved Roles</h1>
        <p className="text-slate-400 text-sm mt-1">Internships you've bookmarked for later</p>
      </div>

      {internships.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-slate-600 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-white mb-2">No saved internships</h3>
            <p className="text-slate-400 text-sm mb-6">Browse internships and save roles you're interested in.</p>
            <Button onClick={() => router.push('/dashboard/internships')}>
              Browse Internships
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {internships.map((internship) => (
            <Link key={internship.id} href={`/dashboard/internships/${internship.id}`}>
              <Card hover className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/[0.08]">
                      <Building2 className="w-5 h-5 text-slate-400 opacity-70" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate">{internship.title}</h3>
                      <p className="text-sm text-slate-400 truncate">
                        {internship.employer?.companyName || internship.employer?.user?.name || 'Company'}
                      </p>
                    </div>
                  </div>
                  <Badge variant="info">{internship.department || 'General'}</Badge>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 opacity-70" />
                    {internship.location}
                  </span>
                  {internship.stipend && (
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 opacity-70" />
                      {internship.currency || 'USD'} {internship.stipend.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
                  <span className="text-xs text-slate-500">
                    {new Date(internship.publishedAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-1 text-cyan-400 text-sm">
                    View Details <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
