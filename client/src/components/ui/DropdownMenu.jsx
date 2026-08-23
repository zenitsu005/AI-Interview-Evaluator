import React, { useState, useRef, useEffect } from 'react';
import { TbChevronDown as ChevronDown } from 'react-icons/tb';

export default function DropdownMenu({ label, items, onItemSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="flex items-center gap-1.5 py-2 px-3 text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all focus-visible:ring-2 focus-visible:ring-teal-500 rounded-xl outline-none cursor-pointer select-none"
      >
        <span>{label}</span>
        <ChevronDown className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${isOpen ? 'rotate-180 text-teal-400 opacity-100' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-64 bg-[#0E131F]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] p-1.5 z-50 animate-fade-in space-y-1 text-left">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onItemSelect(item.id);
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:text-white hover:bg-white/[0.08] hover:border-white/10 border border-transparent transition-all flex items-center justify-between group cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  {Icon && <Icon className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />}
                  <span className="font-semibold">{item.label}</span>
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
