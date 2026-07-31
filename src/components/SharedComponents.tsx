// === iHomeCare Shared Components ===

import { type FC } from 'react';
import { AlertTriangle } from 'lucide-react';

/* ─── Skeleton Loading ─── */

export const SkeletonCard: FC<{ lines?: number }> = ({ lines = 3 }) => (
  <div className="med-card p-4 space-y-3">
    <div className="skeleton h-4 w-2/3" />
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className="skeleton h-3 w-full" style={{ width: `${70 + Math.random() * 30}%` }} />
    ))}
  </div>
);

export const SkeletonGrid: FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} lines={4} />
    ))}
  </div>
);

export const SkeletonTable: FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="med-card p-4 space-y-3">
    <div className="skeleton h-5 w-1/4 mb-4" />
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4">
        <div className="skeleton h-4 w-1/5" />
        <div className="skeleton h-4 w-2/5" />
        <div className="skeleton h-4 w-1/6" />
      </div>
    ))}
  </div>
);

/* ─── Empty State ─── */

export const EmptyState: FC<{
  icon?: FC<{ className?: string }>;
  title: string;
  description: string;
  action?: React.ReactNode;
}> = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    {Icon && (
      <div className="w-16 h-16 bg-gold-100 rounded-lg flex items-center justify-center mb-4 border border-[#d2c4be]">
        <Icon className="w-8 h-8 text-gold-700" />
      </div>
    )}
    <h3 className="text-base font-semibold text-slate-700 mb-1 font-display">{title}</h3>
    <p className="text-sm text-slate-500 text-center max-w-xs mb-4 font-body">{description}</p>
    {action}
  </div>
);

/* ─── Status Badge ─── */

export const StatusBadge: FC<{ status: string; label?: string }> = ({ status, label }) => {
  const colors: Record<string, string> = {
    critical: 'bg-red-50 text-red-700 border-red-200',
    attention: 'bg-amber-50 text-amber-700 border-amber-200',
    stable: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    connected: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    syncing: 'bg-amber-50 text-amber-700 border-amber-200',
    disconnected: 'bg-slate-50 text-slate-600 border-slate-200',
    high: 'bg-amber-50 text-amber-700 border-amber-200',
    moderate: 'bg-blue-50 text-blue-700 border-blue-200',
    low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    cancelled: 'bg-slate-50 text-slate-500 border-slate-200',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${colors[status.toLowerCase()] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
      {label || status}
    </span>
  );
};

/* ─── Teal Accent Section Header ─── */

export const SectionHeader: FC<{
  title: string;
  subtitle?: string;
  icon?: FC<{ className?: string }>;
  action?: React.ReactNode;
}> = ({ title, subtitle, icon: Icon, action }) => (
  <div className="flex items-center justify-between mb-5">
    <div className="flex items-center gap-3">
      {Icon && (
        <div className="w-10 h-10 bg-gold-100 rounded flex items-center justify-center border border-[#d2c4be]">
          <Icon className="w-5 h-5 text-gold-700" />
        </div>
      )}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 font-display">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 font-body">{subtitle}</p>}
      </div>
    </div>
    {action}
  </div>
);

/* ─── Teal Primary Button ─── */

export const PrimaryButton: FC<{
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}> = ({ children, onClick, disabled, className = '' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-1.5 px-4 py-2 bg-gold-600 text-white text-xs font-semibold rounded hover:bg-gold-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
  >
    {children}
  </button>
);

/* ─── Stat Card ─── */

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon?: FC<{ className?: string }>;
  color?: 'teal' | 'red' | 'amber' | 'emerald' | 'indigo' | 'purple';
  trend?: 'up' | 'down' | 'stable';
}

const STAT_COLORS = {
  teal:    { bg: 'bg-teal-50',   badge: 'bg-teal-600',    text: 'text-teal-700',    border: 'border-l-teal-500' },
  red:     { bg: 'bg-red-50',    badge: 'bg-red-500',     text: 'text-red-700',     border: 'border-l-red-500' },
  amber:   { bg: 'bg-amber-50',  badge: 'bg-amber-500',   text: 'text-amber-700',   border: 'border-l-amber-500' },
  emerald: { bg: 'bg-emerald-50', badge: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-l-emerald-500' },
  indigo:  { bg: 'bg-indigo-50', badge: 'bg-indigo-500',  text: 'text-indigo-700',  border: 'border-l-indigo-500' },
  purple:  { bg: 'bg-purple-50', badge: 'bg-purple-500',  text: 'text-purple-700',  border: 'border-l-purple-500' },
};

export const StatCard: FC<StatCardProps> = ({ label, value, sub, icon: Icon, color = 'teal', trend }) => {
  const c = STAT_COLORS[color];
  return (
    <div className={`bg-white rounded-lg border border-slate-200 border-l-4 ${c.border} p-5 hover:shadow-[0_8px_20px_rgba(29,27,26,0.04)] transition-all duration-200`}>
      <div className="flex items-center justify-between mb-3">
        <span className="label-md text-slate-500">{label}</span>
        {Icon && (
          <div className={`w-10 h-10 rounded ${c.bg} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${c.text}`} />
          </div>
        )}
      </div>
      <p className={`stat-number ${c.text}`}>{value}</p>
      {sub && <p className="text-sm text-slate-500 mt-1.5 font-body">{sub}</p>}
      {trend === 'up' && <span className="text-[10px] text-emerald-600 mt-1 block">↑ Trending up</span>}
      {trend === 'down' && <span className="text-[10px] text-red-600 mt-1 block">↓ Trending down</span>}
    </div>
  );
};

/* ─── AI Risk Banner ─── */

export const RiskBanner: FC<{
  level: 'critical' | 'attention' | 'stable';
  title: string;
  message: string;
}> = ({ level, title, message }) => {
  const colors = {
    critical: { bg: 'bg-red-50 border-red-200', icon: 'text-red-500', title: 'text-red-800', msg: 'text-red-700' },
    attention: { bg: 'bg-amber-50 border-amber-200', icon: 'text-amber-500', title: 'text-amber-800', msg: 'text-amber-700' },
    stable: { bg: 'bg-emerald-50 border-emerald-200', icon: 'text-emerald-500', title: 'text-emerald-800', msg: 'text-emerald-700' },
  };
  const c = colors[level];
  return (
    <div className={`rounded-xl border ${c.bg} p-4`}>
      <div className="flex items-start gap-2">
        <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${c.icon}`} />
        <div>
          <p className={`text-xs font-bold ${c.title}`}>{title}</p>
          <p className={`text-[11px] ${c.msg} mt-0.5`}>{message}</p>
        </div>
      </div>
    </div>
  );
};
