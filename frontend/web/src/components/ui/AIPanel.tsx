import GlassCard from './GlassCard'
import { Button } from './Button'
import { Sparkles, CheckCircle } from 'lucide-react'

interface AIPanelProps {
  title?: string
  matchScore?: number
  insights?: string[]
  cta?: string
  onCtaClick?: () => void
  variant?: 'insight' | 'guidance'
}

export function AIPanel({ 
  title = 'AI Career Insight',
  matchScore,
  insights = [],
  cta,
  onCtaClick,
  variant = 'insight'
}: AIPanelProps) {
  return (
    <GlassCard className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-slate-400 opacity-70" />
        <h3 className="font-medium text-white">{title}</h3>
      </div>

      {matchScore && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-sky-500/80 to-cyan-400/70 rounded-full transition-all duration-500"
              style={{ width: `${matchScore}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-white">{matchScore}%</span>
        </div>
      )}

      {insights.length > 0 && (
        <div className="space-y-2">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-2 text-sm text-slate-300">
              <CheckCircle className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0 opacity-70" />
              <span>{insight}</span>
            </div>
          ))}
        </div>
      )}

      {cta && (
        <Button 
          onClick={onCtaClick}
          size="sm"
          className="w-full mt-2"
        >
          {cta}
        </Button>
      )}
    </GlassCard>
  )
}
