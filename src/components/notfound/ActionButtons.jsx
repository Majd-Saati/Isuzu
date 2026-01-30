import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';

/**
 * Action buttons component for 404 page
 */
export const ActionButtons = ({
  onHome,
  onBack,
}) => (
  <div
    className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6 animate-fade-in"
    style={{ animationDelay: '0.6s' }}
  >
    <button
      onClick={onHome}
      className="group w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E60012] to-[#C00010] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
    >
      <Home className="w-4 h-4 group-hover:rotate-12 transition-transform" />
      <span>Back to Home</span>
    </button>

    <button
      onClick={onBack}
      className="group w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold border-2 border-gray-200 dark:border-gray-700 hover:border-[#E60012] hover:text-[#E60012] transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
    >
      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      <span>Go Back</span>
    </button>
  </div>
);

