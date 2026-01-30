import React, { useState, useRef, useEffect } from 'react';
import { FileText, Upload, Smile, Plus, Loader2 } from 'lucide-react';
import { useCreateActivityMeta } from '@/hooks/api/useActivities';
import { EmojiPicker } from './EmojiPicker';

export const AddEvidenceForm = ({ activityId, planId, companyId, onSuccess, onCancel }) => {
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const createMetaMutation = useCreateActivityMeta();

  // Handle click outside to close emoji picker
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target) && 
          !e.target.closest('[data-emoji-trigger]')) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    createMetaMutation.mutate(
      {
        activity_id: activityId,
        plan_id: planId,
        company_id: companyId,
        type: 'evidence',
        description: description.trim(),
        media,
      },
      {
        onSuccess: () => {
          setDescription('');
          setMedia(null);
          setShowEmojiPicker(false);
          onSuccess?.();
        },
      }
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setMedia(file);
    }
  };

  const handleEmojiSelect = (emoji) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = description.substring(0, start) + emoji + description.substring(end);
      setDescription(newValue);
      
      // Set cursor position after emoji
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        textarea.focus();
      }, 0);
    } else {
      setDescription(prev => prev + emoji);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="w-4 h-4 text-[#E60012]" />
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Add New Evidence</h4>
      </div>

      {/* Description with Emoji Picker */}
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Evidence *</label>
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter evidence description..."
            rows={3}
            className="w-full px-3 py-2.5 pr-10 rounded-lg bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 transition-all resize-none"
            required
          />
          <button
            type="button"
            data-emoji-trigger
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`absolute right-2 bottom-2 p-1.5 rounded-lg transition-all ${
              showEmojiPicker 
                ? 'bg-[#E60012]/10 text-[#E60012]' 
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Smile className="w-5 h-5" />
          </button>
        </div>
        
        {/* Emoji Picker - Full width below input */}
        {showEmojiPicker && (
          <EmojiPicker 
            onSelect={handleEmojiSelect} 
            onClose={() => setShowEmojiPicker(false)}
            pickerRef={emojiPickerRef}
          />
        )}
      </div>

      {/* Media Upload */}
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Attachment (Optional)</label>
        <div className="relative">
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="evidence-media-upload"
            accept="image/*,.pdf,.doc,.docx"
          />
          <label
            htmlFor="evidence-media-upload"
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all"
          >
            <Upload className="w-4 h-4" />
            {media ? media.name : 'Select file'}
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={createMetaMutation.isPending || !description.trim()}
          className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-[#E60012] hover:bg-[#cc0010] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {createMetaMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add Evidence
            </>
          )}
        </button>
      </div>
    </form>
  );
};
