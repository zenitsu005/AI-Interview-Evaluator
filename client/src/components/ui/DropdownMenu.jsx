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
        <div className="absolute top-full left-0 mt-2 w-72 bg-[#0E131F]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.7)] p-2 z-50 animate-fade-in space-y-1 text-left">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onItemSelect(item.id);
                  setIsOpen(false);
                }}
                className="w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center gap-3 group hover:bg-white/[0.06] border border-transparent hover:border-white/10 cursor-pointer"
              >
                {/* Clerk-Style Icon Card Tile */}
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] group-hover:bg-white/[0.12] border border-white/10 group-hover:border-teal-400/40 flex items-center justify-center text-slate-200 group-hover:text-teal-300 shadow-sm shrink-0 transition-all">
                  {Icon && <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />}
                </div>

                {/* Text Block */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-white group-hover:text-teal-300 transition-colors text-xs truncate">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-teal-950/80 text-teal-300 border border-teal-500/30">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.desc && (
                    <p className="text-[11px] text-slate-400 group-hover:text-slate-300 transition-colors leading-tight truncate mt-0.5">
                      {item.desc}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
