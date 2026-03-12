import { useState, useEffect } from 'react';

const SCROLL_OFFSET = 120;

/**
 * Scroll to a section by id. Targets the section's title (first h1–h6) when present.
 * @param {string} id - Section element id
 */
export const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  const title = el.querySelector('h1, h2, h3, h4, h5, h6');
  const target = title || el;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

/**
 * Track which section is currently in view.
 * @param {Array<{ id: string }>} sections
 * @returns {string|null} activeSectionId
 */
export const useActiveSection = (sections) => {
  const [activeId, setActiveId] = useState(null);
  const ids = sections?.map((s) => s.id).filter(Boolean) ?? [];

  useEffect(() => {
    if (ids.length === 0) return;

    const handleScroll = () => {
      const scrollY = window.scrollY + SCROLL_OFFSET;
      let current = null;
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.offsetTop <= scrollY) {
          current = ids[i];
          break;
        }
      }
      if (!current && ids.length) {
        const first = document.getElementById(ids[0]);
        if (first && first.getBoundingClientRect().top <= SCROLL_OFFSET) current = ids[0];
      }
      setActiveId(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ids.join(',')]);

  return activeId;
};
