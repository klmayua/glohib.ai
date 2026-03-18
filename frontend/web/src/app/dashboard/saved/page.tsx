'use client'

import { Heart, Building2, MapPin, DollarSign, ArrowRight } from 'lucide-react'
import { Card, Button, Badge } from '@/components/ui'
import Link from 'next/link'

export default function SavedPage() {
  // Mock saved internships - in real app, fetch from API
  const savedInternships = [
    {
      id: '1',
      title: 'Product Management Intern',
      company: 'Tech Corp',
      location: 'Remote',
      stipend: 5000,
      department: 'Product'
    },
    {
      id: '2',
      title: 'Data Science Intern',
      company: 'Health Inc',
      location: 'New York, NY',
      stipend: 6000,
      department: 'Data'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Saved Roles</h1>
        <p className="text-slate-400 text-sm mt-1">Internships you've saved for later</p>
      </div>

      {/* Saved List */}
      {savedInternships.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-slate-600 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-white mb-2">No saved roles yet</h3>
            <p className="text-slate-400 text-sm mb-6">
              Save interesting internships to review them later.
            </p>
            <Button onClick={() => window.location.href = '/dashboard/internships'}>
              Browse Internships
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedInternships.map((internship) => (
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
                  <Badge variant="info">{internship.department}</Badge>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 opacity-70" />
                    {internship.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 opacity-70" />
                    ${internship.stipend.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
                  <span className="text-xs text-slate-500">Saved recently</span>
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
