import React from 'react';
import { MapPin, AlertCircle } from 'lucide-react';

/**
 * Icon section component for 404 page
 */
export const IconSection = () => (
  <div className="flex justify-center mb-4 animate-fade-in">
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#E60012] to-[#F38088] rounded-full blur-2xl opacity-20 animate-pulse" />
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#E60012] to-[#F38088] rounded-full flex items-center justify-center shadow-xl">
        <MapPin
          className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-bounce"
          style={{ animationDuration: '2s' }}
        />
      </div>
      <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
        <AlertCircle className="w-4 h-4 text-white" />
      </div>
    </div>
  </div>
);

