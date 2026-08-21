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
    default: 'bg-zinc-900/90 border-zinc-800 shadow-layered p-6',
    bento: 'bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border-zinc-800/80 p-6 hover:border-zinc-700 shadow-layered',
    glass: 'bg-zinc-900/60 border-zinc-800/60 backdrop-blur-xl p-6 shadow-2xl',
    interactive: 'bg-zinc-900/90 border-zinc-800 p-6 hover:border-indigo-500/50 hover:scale-[1.01] cursor-pointer shadow-layered group',
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
