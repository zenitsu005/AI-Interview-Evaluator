import React from 'react';

export default function Card({
  children,
  variant = 'default', // 'default' | 'bento' | 'glass' | 'interactive'
  className = '',
  onClick,
  ...props
}) {
  const baseStyles = 'rounded-3xl transition-all duration-200 border text-left relative overflow-hidden';
  
  const variantStyles = {
    default: 'bg-[#131823] border-white/10 shadow-2xl p-6 text-slate-100',
    bento: 'bg-[#131823] border-white/10 p-6 hover:border-white/20 shadow-2xl text-slate-100',
    glass: 'bg-[#131823]/80 border-white/10 backdrop-blur-xl p-6 shadow-2xl text-slate-100',
    interactive: 'bg-[#131823] border-white/10 p-6 hover:border-teal-400/40 hover:shadow-teal-500/10 cursor-pointer shadow-2xl group text-slate-100',
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
