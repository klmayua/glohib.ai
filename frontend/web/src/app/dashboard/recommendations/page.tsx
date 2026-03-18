'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, Building2, MapPin, DollarSign, ArrowRight } from 'lucide-react'
import { Card, Button, Badge } from '@/components/ui'
import { useDashboardStore } from '@/store/zustandStore'

export default function RecommendationsPage() {
  const router = useRouter()
  const { internships, setInternships } = useDashboardStore()

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const fetchRecommendations = async () => {
    try {
      const res = await fetch('/api/recommendations', { credentials: 'include' })
      const data = await res.json()
      setInternships(data.recommendations || [])
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Recommended For You</h1>
        <p className="text-slate-400 text-sm mt-1">AI-powered internship matches based on your profile</p>
      </div>

      {/* AI Insight */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-5 h-5 text-sky-400" />
          <h2 className="font-medium text-white">AI Match Insights</h2>
        </div>
        <p className="text-slate-300 text-sm">
          These internships are matched based on your skills, experience, and preferences. 
          Complete your profile to get more accurate recommendations.
        </p>
      </Card>

      {/* Recommendations List */}
      {internships.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Sparkles className="w-16 h-16 text-slate-600 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-white mb-2">No recommendations yet</h3>
            <p className="text-slate-400 text-sm mb-6">
              Complete your profile to receive personalized internship recommendations.
            </p>
            <Button onClick={() => router.push('/dashboard/profile')}>
              Complete Profile
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {internships.map((internship: any) => (
            <Link key={internship.id} href={`/dashboard/internships/${internship.id}`}>
              <Card hover className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/[0.08]">
                      <Building2 className="w-5 h-5 text-slate-400 opacity-70" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{internship.title}</h3>
                      <p className="text-sm text-slate-400">{internship.company}</p>
                    </div>
                  </div>
                  <Badge variant="info">
                    {internship.match}% match
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 opacity-70" />
                    {internship.location}
                  </span>
                  {internship.stipend && (
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 opacity-70" />
                      ${internship.stipend.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
                  <span className="text-xs text-slate-500">Posted {internship.posted}</span>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button size="sm">Apply</Button>
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
