import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default function TermsPage() {
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
        <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
        <p className="text-slate-400 mb-8">Last updated: April 5, 2026</p>

        <div className="space-y-8 text-slate-300">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-400">By accessing or using Glohib.ai, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the platform.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Eligibility</h2>
            <p className="text-slate-400">You must be at least 16 years old to use Glohib.ai. Students must be currently enrolled in or recently graduated from an educational institution. Employers must represent legitimate organizations seeking to hire interns.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. User Accounts</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-400">
              <li>You are responsible for maintaining the confidentiality of your account</li>
              <li>You must provide accurate and complete registration information</li>
              <li>You must notify us immediately of any unauthorized access</li>
              <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Internship Applications</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-400">
              <li>Applications submitted through Glohib.ai are binding expressions of interest</li>
              <li>You agree to provide truthful information in applications</li>
              <li>Glohib.ai does not guarantee placement or employment</li>
              <li>Employers make independent hiring decisions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. AI Recommendations</h2>
            <p className="text-slate-400">Our AI-powered matching algorithm provides internship recommendations based on your profile data. These recommendations are suggestions only and do not constitute guarantees of acceptance or fit.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Intellectual Property</h2>
            <p className="text-slate-400">All content, features, and functionality of Glohib.ai are owned by Glohib.ai and are protected by international copyright, trademark, and other intellectual property laws.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Limitation of Liability</h2>
            <p className="text-slate-400">Glohib.ai is not liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform. Our total liability shall not exceed the amount you paid to use the service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Changes to Terms</h2>
            <p className="text-slate-400">We may update these terms at any time. Continued use after changes constitutes acceptance of the new terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Contact</h2>
            <p className="text-slate-400">For questions about these terms, contact us at <span className="text-cyan-400">legal@glohib.ai</span>.</p>
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
