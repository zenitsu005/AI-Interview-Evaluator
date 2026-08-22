import React from 'react';
import Button from './Button';
import { Inbox } from 'lucide-react';

export default function EmptyState({
  icon = null,
  title = 'No Records Found',
  description = 'There are no active sessions or evaluations to display right now.',
  actionLabel = 'Go Back',
  onAction,
  className = '',
}) {
  return (
    <div className={`p-8 sm:p-12 bg-[#131823]/80 border border-white/10 rounded-3xl text-center space-y-4 max-w-md mx-auto shadow-2xl backdrop-blur-xl text-slate-100 ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-teal-950/80 border border-teal-500/30 flex items-center justify-center text-teal-400 mx-auto shadow-inner">
        {icon || <Inbox className="w-7 h-7" />}
      </div>
      <div className="space-y-1.5">
        <h3 className="text-lg font-bold text-white text-balance">{title}</h3>
        <p className="text-xs text-slate-400 leading-relaxed text-pretty">{description}</p>
      </div>
      {actionLabel && onAction && (
        <div className="pt-2">
          <Button variant="secondary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
