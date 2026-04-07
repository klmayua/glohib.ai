'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/auth-store'

interface Skill {
  name: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  yearsOfExperience?: number
  category?: string
}

interface Education {
  institution: string
  degree?: string
  fieldOfStudy?: string
  startDate: string
  endDate?: string
  description?: string
  gpa?: number
}

interface Experience {
  company: string
  position: string
  startDate: string
  endDate?: string
  description?: string
  location?: string
  isCurrent: boolean
}

interface Interest {
  category: string
  value: string
  priority: number
}

export default function StudentOnboardingPage() {
  const router = useRouter()
  const authUser = useAuthStore((state) => state.user)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Step 1: Basic Info
  const [basicInfo, setBasicInfo] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    currentLocation: '',
  })

  // Step 2: Education
  const [academicInfo, setAcademicInfo] = useState({
    university: '',
    major: '',
    graduationYear: new Date().getFullYear() + 2,
    degreeLevel: 'Bachelor',
    gpa: '',
  })

  // Step 3: Skills
  const [skills, setSkills] = useState<Skill[]>([])
  const [newSkill, setNewSkill] = useState('')
  const [skillLevel, setSkillLevel] = useState<Skill['level']>('Intermediate')

  // Step 4: Experience
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [showExperienceForm, setShowExperienceForm] = useState(false)
  const [currentExperience, setCurrentExperience] = useState<Experience>({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: '',
    location: '',
    isCurrent: false,
  })

  // Step 5: Interests
  const [interests, setInterests] = useState<Interest[]>([
    { category: 'Industry', value: '', priority: 1 },
    { category: 'Role', value: '', priority: 1 },
    { category: 'Location', value: '', priority: 1 },
  ])

  const [bio, setBio] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')

  const addSkill = () => {
    if (!newSkill.trim()) return
    setSkills([...skills, { name: newSkill.trim(), level: skillLevel }])
    setNewSkill('')
  }

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index))
  }

  const addExperience = () => {
    if (!currentExperience.company || !currentExperience.position) return
    setExperiences([...experiences, { ...currentExperience }])
    setCurrentExperience({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
      location: '',
      isCurrent: false,
    })
    setShowExperienceForm(false)
  }

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index))
  }

  const updateInterest = (index: number, value: string) => {
    const updated = [...interests]
    updated[index].value = value
    setInterests(updated)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/onboarding/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...basicInfo,
          ...academicInfo,
          gpa: academicInfo.gpa ? parseFloat(academicInfo.gpa) : undefined,
          skills,
          education: [
            {
              institution: academicInfo.university,
              degree: academicInfo.degreeLevel,
              fieldOfStudy: academicInfo.major,
              startDate: new Date(new Date().getFullYear() - 4, 0, 1).toISOString(),
              endDate: new Date(academicInfo.graduationYear, 5, 1).toISOString(),
            },
          ],
          experience: experiences,
          interests: interests.filter(i => i.value),
          bio,
          linkedinUrl,
          githubUrl,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/dashboard')
      } else {
        setError(data.error || 'Failed to complete onboarding')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return basicInfo.firstName && basicInfo.lastName && basicInfo.currentLocation
      case 2:
        return academicInfo.university && academicInfo.major && academicInfo.graduationYear
      case 3:
        return skills.length > 0
      case 4:
        return true // Experience is optional
      case 5:
        return bio.length >= 50
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  s <= step
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s < step ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  s
                )}
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Basic Info</span>
            <span>Education</span>
            <span>Skills</span>
            <span>Experience</span>
            <span>Interests</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Tell us about yourself</h2>
              <p className="text-gray-600">Let's start with some basic information about you.</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    value={basicInfo.firstName}
                    onChange={(e) => setBasicInfo({ ...basicInfo, firstName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    value={basicInfo.lastName}
                    onChange={(e) => setBasicInfo({ ...basicInfo, lastName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={basicInfo.dateOfBirth}
                  onChange={(e) => setBasicInfo({ ...basicInfo, dateOfBirth: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                <input
                  type="text"
                  value={basicInfo.nationality}
                  onChange={(e) => setBasicInfo({ ...basicInfo, nationality: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Nigerian, Indian, Brazilian"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Location *</label>
                <input
                  type="text"
                  value={basicInfo.currentLocation}
                  onChange={(e) => setBasicInfo({ ...basicInfo, currentLocation: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Lagos, Nigeria"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={basicInfo.phone}
                  onChange={(e) => setBasicInfo({ ...basicInfo, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+234 801 234 5678"
                />
              </div>
            </div>
          )}

          {/* Step 2: Education */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Education</h2>
              <p className="text-gray-600">Tell us about your current or most recent education.</p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">University *</label>
                <input
                  type="text"
                  value={academicInfo.university}
                  onChange={(e) => setAcademicInfo({ ...academicInfo, university: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., University of Lagos"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Major/Field of Study *</label>
                <input
                  type="text"
                  value={academicInfo.major}
                  onChange={(e) => setAcademicInfo({ ...academicInfo, major: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Public Health, Biology"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Degree Level</label>
                  <select
                    value={academicInfo.degreeLevel}
                    onChange={(e) => setAcademicInfo({ ...academicInfo, degreeLevel: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Bachelor">Bachelor's</option>
                    <option value="Master">Master's</option>
                    <option value="PhD">PhD</option>
                    <option value="Associate">Associate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year *</label>
                  <input
                    type="number"
                    value={academicInfo.graduationYear}
                    onChange={(e) => setAcademicInfo({ ...academicInfo, graduationYear: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min={new Date().getFullYear()}
                    max={new Date().getFullYear() + 10}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GPA (Optional)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="5"
                  value={academicInfo.gpa}
                  onChange={(e) => setAcademicInfo({ ...academicInfo, gpa: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 3.5"
                />
              </div>
            </div>
          )}

          {/* Step 3: Skills */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Skills</h2>
              <p className="text-gray-600">Add at least 3 skills to get better internship recommendations.</p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a skill (e.g., Data Analysis, Research)"
                />
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value as Skill['level'])}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <button
                  onClick={addSkill}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg"
                  >
                    <span className="font-medium text-gray-900">{skill.name}</span>
                    <span className="text-sm text-gray-600">({skill.level})</span>
                    <button
                      onClick={() => removeSkill(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {skills.length === 0 && (
                <p className="text-center text-gray-500 py-8">No skills added yet. Add your first skill above.</p>
              )}
            </div>
          )}

          {/* Step 4: Experience */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Work Experience</h2>
              <p className="text-gray-600">Add any relevant work experience (optional but recommended).</p>

              {experiences.length > 0 && (
                <div className="space-y-3">
                  {experiences.map((exp, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                          <p className="text-gray-600">{exp.company}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(exp.startDate).toLocaleDateString()} - {exp.isCurrent ? 'Present' : new Date(exp.endDate!).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => removeExperience(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!showExperienceForm ? (
                <button
                  onClick={() => setShowExperienceForm(true)}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-all"
                >
                  + Add Work Experience
                </button>
              ) : (
                <div className="border border-gray-200 rounded-lg p-6 space-y-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                      <input
                        type="text"
                        value={currentExperience.company}
                        onChange={(e) => setCurrentExperience({ ...currentExperience, company: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Company name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                      <input
                        type="text"
                        value={currentExperience.position}
                        onChange={(e) => setCurrentExperience({ ...currentExperience, position: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your position"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                      <input
                        type="date"
                        value={currentExperience.startDate}
                        onChange={(e) => setCurrentExperience({ ...currentExperience, startDate: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input
                        type="date"
                        value={currentExperience.endDate}
                        onChange={(e) => setCurrentExperience({ ...currentExperience, endDate: e.target.value })}
                        disabled={currentExperience.isCurrent}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={currentExperience.isCurrent}
                        onChange={(e) => setCurrentExperience({ ...currentExperience, isCurrent: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">I currently work here</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={currentExperience.location}
                      onChange={(e) => setCurrentExperience({ ...currentExperience, location: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Lagos, Nigeria"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={currentExperience.description}
                      onChange={(e) => setCurrentExperience({ ...currentExperience, description: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Describe your responsibilities and achievements..."
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={addExperience}
                      className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-all"
                    >
                      Save Experience
                    </button>
                    <button
                      onClick={() => setShowExperienceForm(false)}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Interests & Bio */}
          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Interests</h2>
              <p className="text-gray-600">Help us match you with relevant internships.</p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio (at least 50 characters) *</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Tell us about yourself, your career goals, and what you're looking for in an internship..."
                />
                <p className={`text-sm mt-1 ${bio.length < 50 ? 'text-red-500' : 'text-green-600'}`}>
                  {bio.length} / 50 characters minimum
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Preferred Industries</h3>
                <input
                  type="text"
                  value={interests[0].value}
                  onChange={(e) => updateInterest(0, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Global Health, Public Health, Epidemiology"
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Preferred Roles</h3>
                <input
                  type="text"
                  value={interests[1].value}
                  onChange={(e) => updateInterest(1, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Research Assistant, Program Coordinator"
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Preferred Locations</h3>
                <input
                  type="text"
                  value={interests[2].value}
                  onChange={(e) => updateInterest(2, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Geneva, New York, Remote"
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Social Links (Optional)</h3>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="LinkedIn profile URL"
                />
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="GitHub profile URL"
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
              >
                ← Previous
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || loading}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Completing...' : 'Complete Onboarding 🎉'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
