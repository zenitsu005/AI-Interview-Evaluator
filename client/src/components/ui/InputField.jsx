import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function InputField({
  label,
  error,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  className = '',
  ...props
}) {
  return (
    <div className="space-y-1.5 text-left">
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full bg-[#0D111A] border ${
          error ? 'border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 bg-rose-950/20 animate-shake' : 'border-white/10 focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20'
        } rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all duration-200 shadow-inner ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-rose-400 flex items-center gap-1.5 mt-1 font-medium">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
