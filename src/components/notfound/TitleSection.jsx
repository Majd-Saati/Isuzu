import React from 'react';

/**
 * Title section component for 404 page
 */
export const TitleSection = () => (
  <div className="text-center mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
    <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold bg-gradient-to-br from-[#E60012] via-[#F38088] to-[#E60012] bg-clip-text text-transparent mb-3 animate-scale-in">
      404
    </h1>
    <div className="h-1 w-20 mx-auto bg-gradient-to-r from-transparent via-[#E60012] to-transparent rounded-full mb-4" />
  </div>
);

