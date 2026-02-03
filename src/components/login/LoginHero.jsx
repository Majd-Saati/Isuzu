import React from 'react';
import { FeatureCards } from './FeatureCards';

export const LoginHero = () => {
  return (
    <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden bg-gradient-to-br from-[#D22827] via-[#b82221] to-[#8b1a19]">
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-white w-full h-full">
        <div className="mb-10">
          <h1 className="text-4xl xl:text-5xl font-bold mb-5 leading-tight text-white">
            ISUZU<br />Management System
          </h1>
          <p className="text-lg text-white/90 max-w-md leading-relaxed">
            Centralized platform for managing dealer marketing plans, budgets, and performance analytics.
          </p>
        </div>
        <FeatureCards />
      </div>
    </div>
  );
};

