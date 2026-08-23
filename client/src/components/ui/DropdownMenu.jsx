import React, { useState, useRef, useEffect } from 'react';
import { TbChevronDown as ChevronDown } from 'react-icons/tb';

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
        className="flex items-center gap-1.5 py-2 px-3 text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-teal-500 rounded-xl outline-none cursor-pointer"
      >
        <span>{label}</span>
        <ChevronDown className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${isOpen ? 'rotate-180 text-teal-400' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-60 bg-[#131823]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-1.5 z-50 animate-fade-in space-y-1 text-left">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onItemSelect(item.id);
                  setIsOpen(false);
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:text-white hover:bg-white/5 transition-all flex items-center justify-between group cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  {Icon && <Icon className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />}
                  <span>{item.label}</span>
                </span>
                {item.badge && (
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-teal-950/80 text-teal-300 border border-teal-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
