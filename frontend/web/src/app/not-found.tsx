import { notFound } from 'next/navigation'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-semibold text-white">404</h1>
        <p className="text-lg">Page not found</p>
        <p className="text-sm text-slate-500">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      <a
        href="/dashboard"
        className="px-6 py-2.5 rounded-lg bg-sky-500/20 text-sky-300 text-sm font-medium hover:bg-sky-500/30 transition-colors duration-150 border border-sky-400/30"
      >
        Back to Dashboard
      </a>
    </div>
  )
}
