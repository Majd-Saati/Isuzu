import React from 'react';
import { CheckCircle2, Clock3, Ban } from 'lucide-react';

export const statusStyles = {
  done: {
    bg: 'bg-green-100 border-green-200 text-green-700',
    dot: 'bg-green-500',
    text: 'text-green-700',
    icon: <CheckCircle2 className="w-4 h-4" />
  },
  pending: {
    bg: 'bg-red-100 border-red-200 text-red-700',
    dot: 'bg-red-500',
    text: 'text-red-700',
    icon: <Ban className="w-4 h-4" />
  },
  'working on it': {
    bg: 'bg-amber-100 border-amber-200 text-amber-700',
    dot: 'bg-amber-500',
    text: 'text-amber-700',
    icon: <Clock3 className="w-4 h-4" />
  },
};

export const statusOptions = [
  { value: 'done', label: 'Done' },
  { value: 'pending', label: 'Pending' },
  { value: 'working on it', label: 'Working on it' },
];


