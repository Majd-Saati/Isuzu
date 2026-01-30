import React from 'react';
import { Info } from 'lucide-react';

export const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="flex items-center gap-1.5 mt-2">
      <Info className="w-4 h-4 text-red-700 flex-shrink-0" />
      <p className="text-xs text-red-700">{message}</p>
    </div>
  );
};

