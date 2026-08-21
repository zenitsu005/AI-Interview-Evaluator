import React from 'react';

export default function Badge({
  children,
  variant = 'indigo', // 'indigo' | 'emerald' | 'amber' | 'zinc'
  hasPulse = false,
  className = '',
}) {
  const variantStyles = {
    indigo: 'bg-indigo-950/70 border-indigo-500/30 text-indigo-300',
    emerald: 'bg-emerald-950/70 border-emerald-500/30 text-emerald-300',
    amber: 'bg-amber-950/70 border-amber-500/30 text-amber-300',
    zinc: 'bg-zinc-900 border-zinc-800 text-zinc-300',
  };

  const pulseColors = {
    indigo: 'bg-indigo-400',
    emerald: 'bg-emerald-400',
    amber: 'bg-amber-400',
    zinc: 'bg-zinc-400',
  };

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${variantStyles[variant]} ${className}`}>
      {hasPulse && (
        <span className={`w-2 h-2 rounded-full ${pulseColors[variant]} animate-pulse`} />
      )}
      <span>{children}</span>
    </span>
  );
}
