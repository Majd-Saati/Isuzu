import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, X, Search, Check, Users, Building2 } from 'lucide-react';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

/**
 * Professional "To" field for choosing announcement recipients.
 *
 * Renders selected dealers as removable chips and opens a searchable dropdown
 * (with a Select all / Clear all shortcut) to pick from the full dealer list —
 * the same interaction pattern used by email and messaging composers.
 *
 * @param {Array}    dealers  - full dealer list ({ id, label, location })
 * @param {Array}    value    - selected dealer ids
 * @param {Function} onChange - receives the next array of selected ids
 * @param {Function} onBlur   - called when the dropdown closes (marks touched)
 * @param {string}   error
 * @param {boolean}  touched
 */
export const RecipientsField = ({
  dealers = [],
  value = [],
  onChange,
  onBlur,
  error,
  touched,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef(null);

  // Close on outside click.
  useEffect(() => {
    if (!open) return undefined;
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        onBlur?.();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onBlur]);

  const selectedDealers = useMemo(
    () => dealers.filter((d) => value.includes(d.id)),
    [dealers, value]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return dealers;
    return dealers.filter(
      (d) =>
        d.label?.toLowerCase().includes(q) ||
        d.location?.toLowerCase().includes(q)
    );
  }, [dealers, query]);

  const allSelected = dealers.length > 0 && value.length === dealers.length;
  const showError = touched && error;

  const toggle = (id) =>
    onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
  const remove = (id) => onChange(value.filter((x) => x !== id));
  const toggleAll = () => onChange(allSelected ? [] : dealers.map((d) => d.id));

  return (
    <div ref={containerRef} className="relative">
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Recipients <span className="text-[#E60012]">*</span>
        </label>
        {value.length > 0 && (
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {value.length} of {dealers.length} selected
          </span>
        )}
      </div>

      {/* Control (chips + toggle) */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex min-h-[46px] w-full flex-wrap items-center gap-1.5 rounded-xl border-2 bg-white px-3 py-2 text-left transition-colors dark:bg-gray-800 ${
          showError
            ? 'border-red-500 dark:border-red-600'
            : 'border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600'
        }`}
      >
        {selectedDealers.length === 0 ? (
          <span className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
            <Users className="h-4 w-4" />
            Select dealers to notify…
          </span>
        ) : (
          selectedDealers.map((d) => (
            <span
              key={d.id}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#E60012]/10 py-1 pl-2 pr-1 text-xs font-medium text-[#E60012]"
            >
              <Building2 className="h-3 w-3" />
              {d.label}
              <span
                role="button"
                tabIndex={-1}
                aria-label={`Remove ${d.label}`}
                onClick={(e) => {
                  e.stopPropagation();
                  remove(d.id);
                }}
                className="rounded p-0.5 hover:bg-[#E60012]/20"
              >
                <X className="h-3 w-3" />
              </span>
            </span>
          ))
        )}
        <ChevronDown
          className={`ml-auto h-4 w-4 flex-shrink-0 text-gray-400 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {showError && <ErrorMessage message={error} />}

      {/* Dropdown */}
      {open && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {/* Search */}
          <div className="border-b border-gray-100 p-2 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search dealers…"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#E60012] focus:outline-none focus:ring-2 focus:ring-[#E60012]/30 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2 dark:border-gray-700">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {dealers.length} dealer{dealers.length === 1 ? '' : 's'}
            </span>
            <button
              type="button"
              onClick={toggleAll}
              className="text-xs font-semibold text-[#E60012] hover:underline"
            >
              {allSelected ? 'Clear all' : 'Select all'}
            </button>
          </div>

          {/* Options */}
          <div className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-gray-400 dark:text-gray-500">
                No dealers found
              </div>
            ) : (
              filtered.map((d) => {
                const selected = value.includes(d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => toggle(d.id)}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <span
                      className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-colors ${
                        selected
                          ? 'border-[#E60012] bg-[#E60012]'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {selected && <Check className="h-3 w-3 text-white" />}
                    </span>
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#E60012] text-xs font-semibold text-white">
                      {d.label?.charAt(0)?.toUpperCase()}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                        {d.label}
                      </span>
                      {d.location && (
                        <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                          {d.location}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
