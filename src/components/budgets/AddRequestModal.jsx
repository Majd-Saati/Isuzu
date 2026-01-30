import React, { useState } from 'react';
import { X, Download } from 'lucide-react';

export const AddRequestModal = ({ isOpen, onClose }) => {
  const [planName, setPlanName] = useState('');
  const [activities, setActivities] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-[48px] w-[480px] p-8" style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.16)' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-[#344251]">Add Request</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {/* Plan Name Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Plan name / example"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-300 text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 appearance-none bg-no-repeat bg-right pr-12"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23EF4444'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundSize: '20px',
                backgroundPosition: 'right 16px center'
              }}
            />
          </div>

          {/* Activities Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Activities / Activity1 - Activity2 - Activity3"
              value={activities}
              onChange={(e) => setActivities(e.target.value)}
              className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-300 text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 appearance-none bg-no-repeat bg-right pr-12"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23EF4444'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundSize: '20px',
                backgroundPosition: 'right 16px center'
              }}
            />
          </div>

          {/* Upload Quotation Button */}
          <button className="w-full py-6 rounded-xl border-2 border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center justify-center gap-2">
            <span className="text-[#D22827] text-sm font-medium">Upload Quotation</span>
            <Download className="w-4 h-4 text-[#D22827]" />
          </button>

          {/* Submit Button */}
          <button className="w-full py-3.5 bg-[#D22827] hover:bg-[#B01F1E] text-white text-sm font-semibold rounded-xl transition-colors mt-8">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
