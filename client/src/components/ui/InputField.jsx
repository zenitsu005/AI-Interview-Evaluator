import React from 'react';

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
        <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full bg-zinc-950/90 border ${
          error ? 'border-red-500/80 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-950/20 animate-shake' : 'border-zinc-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
        } rounded-xl px-4 py-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none transition-all duration-200 shadow-inner ${className}`}
        {...props}
      />
      {error && (
        <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
          <span>⚠️</span> <span>{error}</span>
        </p>
      )}
    </div>
  );
}
