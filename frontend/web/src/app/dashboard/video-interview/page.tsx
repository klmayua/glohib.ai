'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function VideoInterviewPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [hasPermission, setHasPermission] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      setHasPermission(true)
      setIsRecording(true)
      setRecordingTime(0)

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data)
      }

      mediaRecorder.start()

      // Start timer
      const startTime = Date.now()
      const timer = setInterval(() => {
        setRecordingTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)

      // Store timer cleanup
      ;(mediaRecorder as any).timer = timer
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Unable to access camera. Please ensure you have granted permission.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      // Stop timer
      if ((mediaRecorderRef.current as any).timer) {
        clearInterval((mediaRecorderRef.current as any).timer)
      }

      // Stop all tracks
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const questions = [
    {
      id: 1,
      question: "Tell us about yourself and why you're interested in this position.",
      duration: '2 minutes',
    },
    {
      id: 2,
      question: 'Describe a challenging project you worked on and how you overcame obstacles.',
      duration: '3 minutes',
    },
    {
      id: 3,
      question: 'What are your career goals and how does this internship align with them?',
      duration: '2 minutes',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/dashboard" className="text-2xl font-bold text-indigo-600">
              Glohib.ai
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Interview</h1>
          <p className="text-gray-600">
            Record your responses to complete the video interview assessment
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Video Recording Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Camera Preview</h2>

            <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {!hasPermission && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
                  <div className="text-center text-white">
                    <div className="text-6xl mb-4">📹</div>
                    <p className="mb-4">Camera access required</p>
                    <button
                      onClick={startRecording}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Enable Camera
                    </button>
                  </div>
                </div>
              )}

              {isRecording && (
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                  <span className="text-white font-mono">{formatTime(recordingTime)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-4">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <span>●</span> Start Recording
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="px-8 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <span>■</span> Stop Recording
                </button>
              )}
            </div>
          </div>

          {/* Questions Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Interview Questions</h2>

            {questions.map((q, index) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900">Question {q.id}</h3>
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded">
                    {q.duration}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{q.question}</p>

                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: index === 0 ? '100%' : '0%' }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {index === 0 ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-blue-50 rounded-lg p-6"
        >
          <h3 className="font-semibold text-blue-900 mb-2">Instructions</h3>
          <ul className="space-y-2 text-blue-800">
            <li>• Click "Enable Camera" to grant camera and microphone access</li>
            <li>• Read each question carefully before recording</li>
            <li>• You have one attempt per question</li>
            <li>• Click "Stop Recording" when you're done with your answer</li>
            <li>• Your recording will be automatically saved and submitted</li>
          </ul>
        </motion.div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  )
}

function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
      <div className="grid grid-cols-4 gap-1">
        <NavLink href="/dashboard" icon="🏠" label="Home" />
        <NavLink href="/dashboard/internships" icon="💼" label="Internships" />
        <NavLink href="/dashboard/assessments" icon="📝" label="Assessments" />
        <NavLink href="/dashboard/profile" icon="👤" label="Profile" />
      </div>
    </nav>
  )
}

function NavLink({
  href,
  icon,
  label,
  active = false,
}: {
  href: string
  icon: string
  label: string
  active?: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center py-3 px-2 ${
        active ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      <span className="text-xl mb-1">{icon}</span>
      <span className="text-xs">{label}</span>
    </Link>
  )
}
