import React from 'react';

export default function Card({
  children,
  variant = 'default', // 'default' | 'bento' | 'glass' | 'interactive'
  className = '',
  onClick,
  ...props
}) {
  const baseStyles = 'rounded-2xl transition-all duration-200 border text-left relative overflow-hidden';
  
  const variantStyles = {
    default: 'bg-white border-slate-200 shadow-sm p-6 text-slate-900',
    bento: 'bg-white border-slate-200 p-6 hover:border-slate-300 shadow-sm text-slate-900',
    glass: 'bg-white/90 border-slate-200 backdrop-blur-md p-6 shadow-sm text-slate-900',
    interactive: 'bg-white border-slate-200 p-6 hover:border-teal-500/60 hover:shadow-md cursor-pointer shadow-sm group text-slate-900',
  };

  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
