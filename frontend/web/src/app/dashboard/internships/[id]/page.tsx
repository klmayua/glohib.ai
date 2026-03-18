'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Building2, MapPin, DollarSign, Clock, CheckCircle } from 'lucide-react'
import { Card, Button, Badge } from '@/components/ui'
import Link from 'next/link'

export default function InternshipDetailPage() {
  const params = useParams()
  const router = useRouter()
  
  // Mock data - in real app, fetch from API
  const internship = {
    id: params.id,
    title: 'Product Management Intern',
    company: 'Acme Corp',
    location: 'Remote',
    type: 'Full-time',
    stipend: 5000,
    posted: '2 days ago',
    match: 92,
    department: 'Product',
    description: 'We're looking for a Product Management Intern to join our team and help shape the future of our products. You'll work closely with senior PMs to define product strategy, conduct user research, and drive product development.',
    requirements: [
      'Currently pursuing a degree in Business, Computer Science, or related field',
      'Strong analytical and problem-solving skills',
      'Excellent communication and presentation skills',
      'Passion for technology and user experience',
      'Ability to work in a fast-paced environment'
    ],
    responsibilities: [
      'Conduct market research and competitive analysis',
      'Gather and document product requirements',
      'Collaborate with engineering and design teams',
      'Analyze user feedback and product metrics',
      'Present findings and recommendations to stakeholders'
    ],
    benefits: [
      'Competitive stipend',
      'Flexible working hours',
      'Mentorship from senior PMs',
      'Potential for full-time conversion',
      'Access to learning resources'
    ]
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/dashboard/internships">
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Internships
        </Button>
      </Link>

      {/* Header */}
      <Card>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center border border-white/[0.08]">
              <Building2 className="w-8 h-8 text-slate-400 opacity-70" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white mb-1">
                {internship.title}
              </h1>
              <p className="text-slate-400">{internship.company}</p>
            </div>
          </div>
          <Badge variant="info">
            {internship.match}% match
          </Badge>
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-slate-400 mb-6">
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4 opacity-70" />
            {internship.location}
          </span>
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 opacity-70" />
            {internship.type}
          </span>
          <span className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 opacity-70" />
            {internship.stipend ? `$${internship.stipend.toLocaleString()}/month` : 'Unpaid'}
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 opacity-70" />
            Posted {internship.posted}
          </span>
        </div>

        <div className="flex gap-3">
          <Button className="flex-1">
            Apply Now
          </Button>
          <Button variant="secondary">
            Save
          </Button>
        </div>
      </Card>

      {/* Description */}
      <Card>
        <h2 className="text-lg font-medium text-white mb-4">Description</h2>
        <p className="text-slate-300 leading-relaxed">
          {internship.description}
        </p>
      </Card>

      {/* Requirements */}
      <Card>
        <h2 className="text-lg font-medium text-white mb-4">Requirements</h2>
        <ul className="space-y-2">
          {internship.requirements.map((req, index) => (
            <li key={index} className="flex items-start gap-3 text-slate-300">
              <span className="text-sky-400 mt-1">•</span>
              <span>{req}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Responsibilities */}
      <Card>
        <h2 className="text-lg font-medium text-white mb-4">Responsibilities</h2>
        <ul className="space-y-2">
          {internship.responsibilities.map((resp, index) => (
            <li key={index} className="flex items-start gap-3 text-slate-300">
              <span className="text-sky-400 mt-1">•</span>
              <span>{resp}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Benefits */}
      <Card>
        <h2 className="text-lg font-medium text-white mb-4">Benefits</h2>
        <ul className="space-y-2">
          {internship.benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-3 text-slate-300">
              <span className="text-green-400 mt-1">✓</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Apply CTA */}
      <Card>
        <div className="text-center space-y-4">
          <h3 className="text-lg font-medium text-white">
            Ready to apply?
          </h3>
          <p className="text-slate-400 text-sm">
            Submit your application and take the first step towards your dream internship.
          </p>
          <Button className="w-full max-w-xs">
            Submit Application
          </Button>
        </div>
      </Card>
    </div>
  )
}
