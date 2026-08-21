import React, { useState, useRef, useEffect } from 'react';

export default function DropdownMenu({ label, items, onItemSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="flex items-center gap-1 py-2 px-3 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors focus-visible:ring-2 focus-visible:ring-teal-500 rounded-lg outline-none cursor-pointer"
      >
        <span>{label}</span>
        <span className={`text-[10px] opacity-60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 z-50 animate-fade-in space-y-0.5 text-left">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onItemSelect(item.id);
                setIsOpen(false);
              }}
              className="w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer"
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
