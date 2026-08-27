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
    primary: 'bg-gradient-to-b from-teal-400 to-teal-500 hover:from-teal-300 hover:to-teal-400 text-slate-950 shadow-[0_1px_0_rgba(255,255,255,0.35)_inset,0_10px_20px_-4px_rgba(13,148,136,0.35)] border border-teal-300/40',
    gradient: 'bg-gradient-to-b from-teal-400 via-emerald-400 to-teal-500 hover:from-teal-300 hover:via-emerald-300 hover:to-teal-400 text-slate-950 shadow-[0_1px_0_rgba(255,255,255,0.35)_inset,0_10px_20px_-4px_rgba(13,148,136,0.35)] border border-teal-300/40',
    secondary: 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white border border-white/[0.08] hover:border-white/15 shadow-[0_1px_0_rgba(255,255,255,0.05)_inset]',
    ghost: 'bg-transparent hover:bg-white/[0.05] text-slate-400 hover:text-white',
    danger: 'bg-gradient-to-b from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_8px_16px_-4px_rgba(225,29,72,0.4)] border border-rose-400/30',
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
          <TbLoader2 className="animate-spin h-4 w-4 text-inherit" />
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
