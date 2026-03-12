import React from 'react';
import { useActiveSection } from './hooks/useSectionScroll';
import { scrollToSection } from './hooks/useSectionScroll';
import { SectionNavPanel } from './components/SectionNavPanel';

/**
 * Floating section navigation. Pass an array of { id, label } for each scroll target.
 * Sections must have matching id attributes in the page.
 * @param {{ sections: Array<{ id: string, label: string }> }} props
 */
export const SectionNav = ({ sections }) => {
  const activeId = useActiveSection(sections);

  if (!sections?.length) return null;

  return (
    <SectionNavPanel
      sections={sections}
      activeId={activeId}
      onScrollTo={scrollToSection}
    />
  );
};
