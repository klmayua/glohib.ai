import GlassCard from './GlassCard'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  trend?: string
  trendUp?: boolean
  icon: LucideIcon
}

export function StatCard({ title, value, trend, trendUp, icon: Icon }: StatCardProps) {
  return (
    <GlassCard hover className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon className="w-5 h-5 opacity-70" />
        <span className="text-xs uppercase tracking-wide text-slate-500">{title}</span>
      </div>
      <div>
        <span className="text-2xl font-semibold text-white">{value}</span>
        {trend && (
          <p className={`text-xs mt-1 ${trendUp ? 'text-sky-400' : 'text-slate-500'}`}>
            {trend}
          </p>
        )}
      </div>
    </GlassCard>
  )
}
