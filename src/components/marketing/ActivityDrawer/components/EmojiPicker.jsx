import React, { useState } from 'react';
import { EMOJI_CATEGORIES } from '@/constants/emojis';

export const EmojiPicker = ({ onSelect, onClose, pickerRef }) => {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div 
      ref={pickerRef}
      className="w-full bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg mt-2 animate-scale-in"
    >
      {/* Category Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 px-2 pt-2 overflow-x-auto">
        {EMOJI_CATEGORIES.map((category, index) => (
          <button
            key={category.name}
            type="button"
            onClick={() => setActiveCategory(index)}
            className={`flex-shrink-0 px-3 py-2 text-base rounded-t-lg transition-all ${
              activeCategory === index 
                ? 'bg-gray-100 dark:bg-gray-800' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {/* Emoji Grid */}
      <div className="p-3 max-h-52 overflow-y-auto">
        <div className="grid grid-cols-10 gap-1">
          {EMOJI_CATEGORIES[activeCategory].emojis.map((emoji, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onSelect(emoji)}
              className="w-8 h-8 flex items-center justify-center text-xl hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all hover:scale-110"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
