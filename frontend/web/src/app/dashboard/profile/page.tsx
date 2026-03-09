'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/lib/auth-store'
import { studentAPI } from '@/lib/api'
import { useMutation, useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    skills: '',
    location: '',
    linkedin: '',
    github: '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
  })
  const [isEditing, setIsEditing] = useState(false)
  const [studentId, setStudentId] = useState<string | null>(null)

  // Fetch existing profile
  const { data: profileData } = useQuery({
    queryKey: ['studentProfile', user?.id],
    queryFn: () => user?.id ? studentAPI.get(user.id) : null,
    enabled: !!user?.id,
    retry: false,
  })

  useEffect(() => {
    if (profileData?.data) {
      const p = profileData.data
      setFormData({
        firstName: p.first_name || '',
        lastName: p.last_name || '',
        bio: p.bio || '',
        skills: '',
        location: p.city ? `${p.city}, ${p.country}` : '',
        linkedin: p.linkedin_url || '',
        github: p.github_url || '',
        phone: p.phone || '',
        dateOfBirth: p.date_of_birth ? new Date(p.date_of_birth).toISOString().split('T')[0] : '',
        nationality: p.nationality || '',
      })
      setStudentId(p.id)
    }
  }, [profileData])

  const updateMutation = useMutation({
    mutationFn: (data: any) => {
      if (studentId) {
        return studentAPI.update(studentId, data)
      }
      return studentAPI.create({ ...data, user_id: user?.id })
    },
    onSuccess: (response) => {
      setStudentId(response.data.id)
      setIsEditing(false)
      alert('Profile saved successfully!')
    },
    onError: (error: any) => {
      console.error('Profile save error:', error)
      alert('Failed to save profile. Please try again.')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const payload = {
      user_id: user?.id,
      email: user?.email,
      first_name: formData.firstName,
      last_name: formData.lastName,
      bio: formData.bio,
      phone: formData.phone,
      date_of_birth: formData.dateOfBirth || null,
      nationality: formData.nationality,
      address: formData.location,
      city: formData.location.split(',')[0]?.trim() || '',
      country: formData.location.split(',')[1]?.trim() || '',
      linkedin_url: formData.linkedin,
      github_url: formData.github,
      is_active: true,
    }

    updateMutation.mutate(payload)
  }

  const handleAddSkill = (skillName: string) => {
    if (!studentId || !skillName.trim()) return
    
    const mutation = useMutation({
      mutationFn: (data: any) => studentAPI.addSkill(studentId, data),
      onSuccess: () => {
        alert('Skill added!')
      },
    })
    
    mutation.mutate({ name: skillName, proficiency: 3 })
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to view your profile</p>
          <Link href="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/dashboard" className="text-2xl font-bold text-indigo-600">
              Glohib.ai
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Back to Dashboard
              </Link>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {formData.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {formData.firstName && formData.lastName
                    ? `${formData.firstName} ${formData.lastName}`
                    : 'Complete Your Profile'}
                </h2>
                <p className="text-gray-600">{user?.email}</p>
                {studentId && (
                  <span className="inline-block mt-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    Profile Created
                  </span>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="John"
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Doe"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="+1234567890"
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nationality
                </label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., American, Nigerian, British"
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Tell us about yourself, your interests, and career goals..."
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="City, Country (e.g., Lagos, Nigeria)"
                  disabled={!isEditing}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="https://linkedin.com/in/yourprofile"
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="https://github.com/yourusername"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {updateMutation.isPending ? 'Saving...' : 'Save Profile'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Skills Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Skills</h3>
            <p className="text-gray-600 mb-4">
              Add your technical and soft skills to improve matching
            </p>
            {isEditing && (
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Add a skill (e.g., JavaScript, Python)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddSkill((e.target as HTMLInputElement).value)
                      ;(e.target as HTMLInputElement).value = ''
                    }
                  }}
                />
                <span className="text-sm text-gray-500">Press Enter to add</span>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                Add skills after saving your profile
              </span>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
