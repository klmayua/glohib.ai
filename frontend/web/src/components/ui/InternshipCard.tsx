import GlassCard from './GlassCard'
import { Button } from './Button'
import { Building2, MapPin, DollarSign } from 'lucide-react'

interface InternshipCardProps {
  id: string
  title: string
  company: string
  location: string
  type: string
  stipend?: number
  posted: string
  match?: number
  department: string
  onApply?: () => void
  onView?: () => void
}

export function InternshipCard({ 
  title, 
  company, 
  location, 
  type,
  stipend,
  posted,
  match,
  department,
  onApply,
  onView
}: InternshipCardProps) {
  return (
    <GlassCard hover className="flex flex-col gap-4 cursor-pointer">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/[0.08]">
            <Building2 className="w-5 h-5 text-slate-400 opacity-70" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-white truncate">
              {title}
            </h3>
            <p className="text-sm text-slate-400 truncate">{company}</p>
          </div>
        </div>

        {match && (
          <div className="text-xs font-medium text-sky-400 bg-sky-500/20 px-2.5 py-1 rounded-md border border-sky-400/30 whitespace-nowrap">
            {match}% match
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 opacity-70" />
          {location}
        </span>
        <span className="flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 opacity-70" />
          {stipend ? `$${stipend.toLocaleString()}` : 'Unpaid'}
        </span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
        <span className="text-xs text-slate-500">{posted}</span>
        <div className="flex items-center gap-2">
          <Button 
            onClick={(e) => { e?.stopPropagation(); onView?.(); }}
            variant="ghost"
            size="sm"
          >
            View
          </Button>
          <Button 
            onClick={(e) => { e?.stopPropagation(); onApply?.(); }}
            size="sm"
          >
            Apply
          </Button>
        </div>
      </div>
    </GlassCard>
  )
}
