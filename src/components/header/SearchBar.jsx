import React, { useState } from 'react';
import { Search } from 'lucide-react';

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 md:py-3 rounded-2xl bg-gradient-to-r transition-all duration-300 flex-1 max-w-full md:max-w-[400px] lg:max-w-[500px] ${
      isSearchFocused 
        ? 'from-gray-50 dark:from-gray-800 to-gray-100 dark:to-gray-800 shadow-lg ring-2 ring-[#E60012]/30' 
        : 'from-white dark:from-gray-800 to-gray-50 dark:to-gray-900 shadow-md hover:shadow-lg'
    }`}>
      <Search className={`w-4 h-4 md:w-5 md:h-5 transition-colors duration-300 flex-shrink-0 ${
        isSearchFocused ? 'text-[#E60012]' : 'text-[#848E9A] dark:text-gray-400'
      }`} />
      <input
        type="text"
        placeholder="Search dealers, plans, activities..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsSearchFocused(true)}
        onBlur={() => setIsSearchFocused(false)}
        className="text-[#344251] dark:text-gray-200 bg-transparent border-none outline-none placeholder:text-[#9CA3AF] dark:placeholder:text-gray-500 font-medium w-full text-sm"
      />
    </div>
  );
};
