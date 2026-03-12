import React, { useState, useRef, useEffect } from 'react';
import { List, ChevronUp } from 'lucide-react';
import { SectionNavItem } from './SectionNavItem';

export const SectionNavPanel = ({ sections, activeId, onScrollTo }) => {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  const handleItemClick = (id) => {
    onScrollTo(id);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    const handleEscape = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div ref={panelRef} className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Dropdown: above the button, compact */}
      {open && (
        <div
          className="absolute bottom-full right-0 mb-2 w-56 max-h-[min(70vh,320px)] overflow-y-auto
            rounded-xl border border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-900
            shadow-[0px_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0px_6px_24px_rgba(0,0,0,0.3)]
            py-2 animate-fade-in"
          role="dialog"
          aria-label="Jump to section"
        >
          <nav className="px-2 space-y-0.5" aria-label="Page sections">
            {sections.map(({ id, label }) => (
              <SectionNavItem
                key={id}
                id={id}
                label={label}
                isActive={activeId === id}
                onClick={handleItemClick}
              />
            ))}
          </nav>
        </div>
      )}

      {/* Floating button - bottom right */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close section navigation' : 'Jump to section'}
        aria-expanded={open}
        className="
          flex items-center justify-center w-12 h-12 rounded-full
          bg-[#E60012] hover:bg-[#c40010] dark:bg-red-600 dark:hover:bg-red-700
          text-white shadow-lg hover:shadow-xl transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-[#E60012] focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900
        "
      >
        {open ? <ChevronUp className="w-5 h-5" /> : <List className="w-5 h-5" />}
      </button>
    </div>
  );
};
