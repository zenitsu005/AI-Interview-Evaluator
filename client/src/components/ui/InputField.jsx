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
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full bg-white border ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50 animate-shake' : 'border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20'
        } rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all duration-200 shadow-sm ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1 mt-1 font-medium">
          <span>⚠️</span> <span>{error}</span>
        </p>
      )}
    </div>
  );
}
