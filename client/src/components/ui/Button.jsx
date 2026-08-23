import React from 'react';
import { TbLoader2 } from 'react-icons/tb';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'danger' | 'gradient'
  size = 'md', // 'sm' | 'md' | 'lg'
  isLoading = false,
  isDisabled = false,
  icon,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer';
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-xs sm:text-sm gap-2',
    lg: 'px-6 py-3.5 text-sm sm:text-base gap-2.5 font-extrabold',
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 hover:from-teal-400 hover:via-emerald-400 hover:to-cyan-400 text-slate-950 shadow-lg shadow-teal-500/25 border border-teal-400/40',
    gradient: 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:from-amber-400 hover:via-orange-400 hover:to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/20 border border-amber-400/40',
    secondary: 'bg-[#171E2D] hover:bg-[#1E273A] text-slate-200 hover:text-white border border-white/10 hover:border-white/20 shadow-md',
    ghost: 'bg-transparent hover:bg-white/5 text-slate-400 hover:text-white',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/50 border border-rose-500/40',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <IconLoader2 className="animate-spin h-4 w-4 text-inherit" />
          <span>Loading...</span>
        </span>
      ) : (
        <>
          {icon && <span className="inline-flex items-center">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}
