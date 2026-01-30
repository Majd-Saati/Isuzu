import React from 'react';
import { GripVertical } from 'lucide-react';

export const DrawerResizeHandle = ({ onMouseDown, isDragging }) => {
  return (
    <div
      onMouseDown={onMouseDown}
      className={`absolute left-0 top-0 bottom-0 w-4 cursor-ew-resize group flex items-center justify-center transition-colors z-10 ${
        isDragging ? 'bg-[#E60012]/10' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    >
      {/* Drag indicator */}
      <div className={`flex flex-col items-center justify-center h-20 w-4 rounded transition-all ${
        isDragging ? 'bg-[#E60012]/20' : 'bg-transparent group-hover:bg-gray-200 dark:group-hover:bg-gray-700'
      }`}>
        <GripVertical className={`w-4 h-4 transition-colors ${
          isDragging ? 'text-[#E60012]' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400'
        }`} />
      </div>
    </div>
  );
};
