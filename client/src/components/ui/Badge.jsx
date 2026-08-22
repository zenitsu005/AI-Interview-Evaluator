import React from 'react';

export default function Badge({
  children,
  variant = 'teal', // 'teal' | 'emerald' | 'amber' | 'indigo' | 'slate' | 'rose'
  hasPulse = false,
  className = '',
}) {
  const variantStyles = {
    teal: 'bg-teal-950/70 border-teal-500/30 text-teal-300',
    indigo: 'bg-indigo-950/70 border-indigo-500/30 text-indigo-300',
    emerald: 'bg-emerald-950/70 border-emerald-500/30 text-emerald-300',
    amber: 'bg-amber-950/70 border-amber-500/30 text-amber-300',
    slate: 'bg-slate-900/80 border-slate-700/60 text-slate-300',
    rose: 'bg-rose-950/70 border-rose-500/30 text-rose-300',
  };

  const pulseColors = {
    teal: 'bg-teal-400',
    indigo: 'bg-indigo-400',
    emerald: 'bg-emerald-400',
    amber: 'bg-amber-400',
    slate: 'bg-slate-400',
    rose: 'bg-rose-400',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${variantStyles[variant] || variantStyles.teal} ${className}`}>
      {hasPulse && (
        <span className={`w-2 h-2 rounded-full ${pulseColors[variant] || pulseColors.teal} animate-pulse`} />
      )}
      <span>{children}</span>
    </span>
  );
}
