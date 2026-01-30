import React from 'react';

/**
 * Background decorative elements for 404 page
 */
export const BackgroundDecorations = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#E60012]/5 rounded-full blur-3xl animate-pulse" />
    <div
      className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#14B8A6]/5 rounded-full blur-3xl animate-pulse"
      style={{ animationDelay: '1s' }}
    />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#E60012]/3 to-[#F38088]/3 rounded-full blur-3xl" />
  </div>
);

