import React from 'react';

export const SectionTitle = ({ title, showButton = false, onButtonClick }) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-1.5 bg-gradient-to-b from-[#F38088] to-[#e8566e] rounded-full shadow-sm"></div>
        <h2 className="text-[#1F2937] dark:text-gray-200 text-xl md:text-2xl font-bold leading-7 tracking-tight">
          {title}
        </h2>
      </div>

      {showButton && (
        <button 
          onClick={onButtonClick}
          className="md:hidden bg-white dark:bg-gray-800 shadow-[0px_4px_12px_rgba(0,0,0,0.08)] dark:shadow-[0px_4px_12px_-3px_rgba(0,0,0,0.3)] flex items-center justify-center w-11 h-11 rounded-[22px] hover:shadow-[0px_6px_20px_rgba(0,0,0,0.12)] dark:hover:shadow-[0px_6px_20px_-3px_rgba(0,0,0,0.4)] hover:scale-105 transition-all duration-300 border border-gray-100 dark:border-gray-700"
        >
          <img
            src="https://api.builder.io/api/v1/image/assets/132ea46dcd5a44718cd3517d9e4e8249/5266b22c25a9e6e94988b2837411a5840c3c688c?placeholderIfAbsent=true"
            className="aspect-[0.5] object-contain w-1.5"
            alt="More options"
          />
        </button>
      )}
    </div>
  );
};
