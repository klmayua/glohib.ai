'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter, X, Building2, MapPin, DollarSign, Heart, CheckCircle2 } from 'lucide-react'
import { Card, Button, Badge, Skeleton } from '@/components/ui'
import Link from 'next/link'

interface Internship {
  id: string
  title: string
  description: string
  location: string
  locationType: string
  department: string
  stipend: number | null
  currency: string
  createdAt: string
  publishedAt: string
  applicationDeadline: string
  employer: any
  _count?: { applications: number }
}

export default function InternshipsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [internships, setInternships] = useState<Internship[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [applyingTo, setApplyingTo] = useState<string | null>(null)
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set())
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })

  useEffect(() => {
    fetchInternships()
  }, [pagination.page, searchQuery, selectedFilters])

  const fetchInternships = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: '20',
        ...(searchQuery && { search: searchQuery }),
        ...(selectedFilters.includes('remote') && { locationType: 'REMOTE' }),
        ...(selectedFilters.includes('hybrid') && { locationType: 'HYBRID' }),
        ...(selectedFilters.includes('onsite') && { locationType: 'ON_SITE' }),
      })

      const res = await fetch(`/api/internships?${params}`, { credentials: 'include' })
      const data = await res.json()

      if (data.internships) {
        setInternships(data.internships)
        setPagination(data.pagination)
      }
    } catch (err) {
      console.error('Error fetching internships:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApply = async (e: React.MouseEvent, internshipId: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (appliedIds.has(internshipId)) return

    setApplyingTo(internshipId)
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ internshipId }),
      })
      if (res.ok) {
        setAppliedIds(prev => new Set(prev).add(internshipId))
      }
    } catch (err) {
      console.error('Apply error:', err)
    } finally {
      setApplyingTo(null)
    }
  }

  const handleSave = (e: React.MouseEvent, internshipId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setSavedIds(prev => {
      const next = new Set(prev)
      if (next.has(internshipId)) next.delete(internshipId)
      else next.add(internshipId)
      return next
    })
  }

  const filters = [
    { id: 'remote', label: 'Remote' },
    { id: 'hybrid', label: 'Hybrid' },
    { id: 'onsite', label: 'On-site' },
    { id: 'paid', label: 'Paid' },
  ]

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev =>
      prev.includes(filterId) ? prev.filter(f => f !== filterId) : [...prev, filterId]
    )
    setPagination(p => ({ ...p, page: 1 }))
  }

  const clearFilters = () => {
    setSelectedFilters([])
    setSearchQuery('')
    setPagination(p => ({ ...p, page: 1 }))
  }

  const displayInternships = internships.map(internship => ({
    ...internship,
    match: Math.floor(Math.random() * 20) + 75, // Temporary match score
  }))

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search Section */}
      <Card className="space-y-4">
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 opacity-70" />
          <span className="text-sm font-medium text-slate-300">Search internships</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Describe your dream internship..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
              className="w-full h-11 rounded-lg bg-white/5 border border-white/10 pl-10 pr-5 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-transparent outline-none transition-colors duration-150 min-h-[44px]"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 opacity-70" />
          </div>
          <Button onClick={() => setPagination(p => ({ ...p, page: 1 }))} disabled={isLoading} className="sm:w-auto w-full min-h-[44px]">
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 text-slate-400 mr-2">
          <Filter className="w-4 h-4 opacity-70" />
          <span className="text-sm">Filters:</span>
        </div>
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => toggleFilter(filter.id)}
            className={`px-3 py-2 rounded-full text-xs font-medium border border-transparent transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-sky-500/50 active:scale-95 min-h-[36px] ${
              selectedFilters.includes(filter.id)
                ? 'bg-sky-500/20 text-sky-300 border-sky-400/30'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            {filter.label}
          </button>
        ))}
        {(selectedFilters.length > 0 || searchQuery) && (
          <button onClick={clearFilters} className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-colors duration-150 ml-auto focus:outline-none focus:ring-2 focus:ring-sky-500/50 active:scale-95 min-h-[36px]">
            <X className="w-3.5 h-3.5" /> Clear all
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          Showing {internships.length} of {pagination.total} opportunities
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && internships.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-slate-500 opacity-50" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No internships found</h3>
            <p className="text-slate-400 text-sm mb-6">Try adjusting your search or filters to find more opportunities</p>
            <div className="flex items-center justify-center gap-3">
              <Button variant="secondary" onClick={clearFilters}>Reset Filters</Button>
              <Button onClick={() => router.push('/dashboard/recommendations')}>Browse Recommended Roles</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Internships Grid */}
      {!isLoading && internships.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayInternships.map((internship) => {
            const companyName = internship.employer?.companyName || internship.employer?.user?.name || 'Unknown Company'
            return (
              <Link key={internship.id} href={`/dashboard/internships/${internship.id}`}>
                <Card hover className="flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/[0.08]">
                        <Building2 className="w-5 h-5 text-slate-400 opacity-70" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white truncate">{internship.title}</h3>
                        <p className="text-sm text-slate-400 truncate">{companyName}</p>
                      </div>
                    </div>
                    <Badge variant="info">{internship.match}% match</Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 opacity-70" />
                      {internship.location} ({internship.locationType})
                    </span>
                    {internship.stipend && (
                      <span className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 opacity-70" />
                        {internship.currency} {internship.stipend.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
                    <span className="text-xs text-slate-500">
                      {new Date(internship.publishedAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={(e) => handleSave(e, internship.id)} className="min-h-[44px] min-w-[44px]">
                        <Heart className={`w-4 h-4 ${savedIds.has(internship.id) ? 'fill-red-400 text-red-400' : ''}`} />
                      </Button>
                      {appliedIds.has(internship.id) ? (
                        <Button size="sm" variant="secondary" disabled className="min-h-[44px] flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Applied
                        </Button>
                      ) : (
                        <Button size="sm" onClick={(e) => handleApply(e, internship.id)} disabled={applyingTo === internship.id} className="min-h-[44px]">
                          {applyingTo === internship.id ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : 'Apply'}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          <Button variant="secondary" disabled={pagination.page <= 1} onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}>
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm text-slate-400">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button variant="secondary" disabled={pagination.page >= pagination.totalPages} onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}>
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
