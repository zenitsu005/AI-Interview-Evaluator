import React from 'react';

export default function Card({
  children,
  variant = 'default', // 'default' | 'bento' | 'glass' | 'interactive'
  className = '',
  onClick,
  ...props
}) {
  const baseStyles = 'rounded-2xl transition-all duration-300 border text-left relative overflow-hidden';
  
  const variantStyles = {
    default: 'bg-slate-900/60 border-slate-800/80 backdrop-blur-md shadow-2xl p-6 text-slate-100',
    bento: 'bg-slate-900/60 border-slate-800/80 backdrop-blur-md p-6 hover:border-teal-500/40 shadow-2xl text-slate-100',
    glass: 'bg-slate-900/60 border-slate-800/80 backdrop-blur-xl p-6 shadow-2xl text-slate-100',
    interactive: 'bg-slate-900/60 border-slate-800/80 backdrop-blur-md p-6 hover:border-teal-500/40 hover:-translate-y-1 hover:shadow-teal-500/10 cursor-pointer shadow-xl group text-slate-100',
  };

  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.default} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
