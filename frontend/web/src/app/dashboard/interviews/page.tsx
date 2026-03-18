'use client'

import { useRouter } from 'next/navigation'
import { Video, Clock, CheckCircle, ArrowRight } from 'lucide-react'
import { Card, Button, Badge } from '@/components/ui'
import Link from 'next/link'

export default function InterviewsPage() {
  const router = useRouter()

  // Mock interviews data - in real app, fetch from API
  const interviews = [
    {
      id: '1',
      company: 'Tech Corp',
      role: 'Software Engineering Intern',
      scheduled: '2026-03-20T10:00:00',
      status: 'upcoming',
      type: 'Video Call'
    },
    {
      id: '2',
      company: 'Health Inc',
      role: 'Data Analyst Intern',
      scheduled: '2026-03-15T14:00:00',
      status: 'completed',
      type: 'Phone Screen'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">My Interviews</h1>
        <p className="text-slate-400 text-sm mt-1">Track and prepare for your upcoming interviews</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-sky-400" />
            <div>
              <p className="text-2xl font-semibold text-white">
                {interviews.filter(i => i.status === 'upcoming').length}
              </p>
              <p className="text-xs text-slate-400">Upcoming</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-2xl font-semibold text-white">
                {interviews.filter(i => i.status === 'completed').length}
              </p>
              <p className="text-xs text-slate-400">Completed</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <Video className="w-8 h-8 text-amber-400" />
            <div>
              <p className="text-2xl font-semibold text-white">
                {interviews.length}
              </p>
              <p className="text-xs text-slate-400">Total</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Interviews List */}
      {interviews.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Video className="w-16 h-16 text-slate-600 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-white mb-2">No interviews scheduled</h3>
            <p className="text-slate-400 text-sm mb-6">
              Keep applying to increase your chances of landing interviews.
            </p>
            <Button onClick={() => router.push('/dashboard/internships')}>
              Browse Internships
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {interviews.map((interview) => (
            <Card key={interview.id} hover className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/[0.08]">
                  <Video className="w-6 h-6 text-slate-400 opacity-70" />
                </div>
                <div>
                  <h3 className="font-medium text-white">{interview.role}</h3>
                  <p className="text-sm text-slate-400">{interview.company}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 opacity-70" />
                      {new Date(interview.scheduled).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Video className="w-3 h-3 opacity-70" />
                      {interview.type}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant={interview.status === 'upcoming' ? 'info' : 'success'}>
                  {interview.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                </Badge>
                {interview.status === 'upcoming' && (
                  <Button size="sm">Prepare</Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Interview Prep Tips */}
      <Card>
        <h2 className="text-lg font-medium text-white mb-4">Interview Preparation Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-sky-400">Before the Interview</h3>
            <ul className="space-y-1 text-sm text-slate-300">
              <li>• Research the company thoroughly</li>
              <li>• Review the job description</li>
              <li>• Prepare questions to ask</li>
              <li>• Test your tech setup</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-sky-400">During the Interview</h3>
            <ul className="space-y-1 text-sm text-slate-300">
              <li>• Be confident and authentic</li>
              <li>• Use the STAR method for answers</li>
              <li>• Ask clarifying questions</li>
              <li>• Show enthusiasm for the role</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
