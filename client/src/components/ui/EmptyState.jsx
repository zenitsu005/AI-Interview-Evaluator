import React from 'react';
import Button from './Button';

export default function EmptyState({
  icon = '📭',
  title = 'No Data Found',
  description = 'There are no active records or evaluations to display right now.',
  actionLabel = 'Go Back',
  onAction,
  className = '',
}) {
  return (
    <div className={`p-8 sm:p-12 bg-white border border-slate-200 rounded-2xl text-center space-y-4 max-w-md mx-auto shadow-sm text-slate-900 ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-3xl mx-auto shadow-sm">
        {icon}
      </div>
      <div className="space-y-1.5">
        <h3 className="text-lg font-bold text-slate-900 text-balance">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed text-pretty">{description}</p>
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
