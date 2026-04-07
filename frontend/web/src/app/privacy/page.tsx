import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Glohib<span className="text-cyan-400">.ai</span></span>
          </Link>
          <Link href="/" className="text-slate-400 hover:text-white text-sm">Back to Home</Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        <p className="text-slate-400 mb-8">Last updated: April 5, 2026</p>

        <div className="space-y-8 text-slate-300">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
            <p className="mb-4">We collect information you provide directly, including:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-400">
              <li>Account information (email, name, password)</li>
              <li>Profile data (education, skills, experience, interests)</li>
              <li>Application data (cover letters, resumes, screening answers)</li>
              <li>Communication data (messages, notifications)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-400">
              <li>Matching you with relevant internship opportunities</li>
              <li>Processing your applications</li>
              <li>Providing personalized recommendations</li>
              <li>Sending application status notifications</li>
              <li>Improving our AI matching algorithms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Data Sharing</h2>
            <p className="text-slate-400">We share your profile and application data with employers you apply to. Employers can view your profile information, skills, education, and application materials. We do not sell your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Data Security</h2>
            <p className="text-slate-400">We implement industry-standard security measures including encrypted passwords (bcrypt), HTTPS encryption, and secure database access controls to protect your information.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Your Rights</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-400">
              <li>Access, update, or delete your personal data</li>
              <li>Export your data in a portable format</li>
              <li>Opt out of marketing communications</li>
              <li>Request deletion of your account and all associated data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Contact</h2>
            <p className="text-slate-400">For privacy-related inquiries, contact us at <span className="text-cyan-400">privacy@glohib.ai</span>.</p>
          </section>
        </div>
      </main>

      <footer className="border-t border-white/10 py-8 mt-16">
        <div className="container mx-auto px-6 text-center text-slate-500 text-sm">
          <p>© 2026 Glohib.ai. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
