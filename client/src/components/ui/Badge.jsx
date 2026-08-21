import React from 'react';

export default function Badge({
  children,
  variant = 'teal', // 'teal' | 'emerald' | 'amber' | 'slate'
  hasPulse = false,
  className = '',
}) {
  const variantStyles = {
    teal: 'bg-teal-50 border-teal-200 text-teal-800',
    indigo: 'bg-blue-50 border-blue-200 text-blue-800',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    amber: 'bg-amber-50 border-amber-200 text-amber-900',
    zinc: 'bg-slate-100 border-slate-200 text-slate-800',
    slate: 'bg-slate-100 border-slate-200 text-slate-800',
  };

  const pulseColors = {
    teal: 'bg-teal-600',
    indigo: 'bg-blue-600',
    emerald: 'bg-emerald-600',
    amber: 'bg-amber-600',
    zinc: 'bg-slate-600',
    slate: 'bg-slate-600',
  };

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${variantStyles[variant] || variantStyles.teal} ${className}`}>
      {hasPulse && (
        <span className={`w-2 h-2 rounded-full ${pulseColors[variant] || pulseColors.teal} animate-pulse`} />
      )}
      <span>{children}</span>
    </span>
  );
}
