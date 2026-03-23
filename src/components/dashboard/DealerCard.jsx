import React from 'react';
import { formatDealerCardMoney } from '@/lib/dashboardMoney';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/Tooltip';

/** Visible characters for term name; full text on hover when longer. */
const TERM_NAME_PREVIEW_MAX = 22;

function getTermNameDisplay(label) {
  const full = label != null ? String(label).trim() : '';
  if (!full) return { preview: '—', full: '', truncated: false };
  if (full.length <= TERM_NAME_PREVIEW_MAX) {
    return { preview: full, full, truncated: false };
  }
  return {
    preview: `${full.slice(0, TERM_NAME_PREVIEW_MAX)}…`,
    full,
    truncated: true,
  };
}

export const DealerCard = ({
  name,
  avatar,
  flag,
  terms = [],
  support = 0,
  expense = 0,
  estimatedCost = 0,
  totalCost = 0,
  isAdmin = false,
}) => {

  const hasTerms = terms.length > 0;



  return (

    <div className="group bg-white dark:bg-gray-900 shadow-[0px_4px_16px_rgba(0,0,0,0.06)] dark:shadow-[0px_6px_20px_-5px_rgba(0,0,0,0.3)] flex flex-col items-stretch justify-center w-full px-5 sm:px-7 py-5 sm:py-6 rounded-[24px] hover:shadow-[0px_8px_24px_rgba(0,0,0,0.12)] dark:hover:shadow-[0px_12px_32px_-8px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-300 border border-gray-100/80 dark:border-gray-800 overflow-hidden backdrop-blur-sm bg-white/95 dark:bg-gray-900">

      <div className="w-full">

        <div className="flex w-full items-center justify-between gap-4 mb-6">

          <div className="flex items-center gap-3.5 text-base md:text-lg text-[#F38088] font-bold flex-1 min-w-0 group-hover:text-[#e8566e] transition-colors">

            <div className="relative">

              <img

                src={avatar}

                className="aspect-[1] object-contain w-11 shrink-0 rounded-full ring-2 ring-pink-100 dark:ring-pink-900/30 group-hover:ring-pink-200 dark:group-hover:ring-pink-800/50 transition-all shadow-md hover:shadow-lg"

                alt={name}

              />

              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 shadow-sm"></div>

            </div>

            <div className="text-ellipsis truncate flex-1">{name}</div>

          </div>

          <div className="flex items-center justify-center w-10 shrink-0 group-hover:scale-110 transition-transform">

            <img

              src={flag}

              className="aspect-[1.56] object-contain w-10 rounded-md shadow-sm"

              alt="Flag"

            />

          </div>

        </div>



        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-start sm:gap-5 font-normal min-w-0">

          <div className="w-full min-w-0 sm:flex-1 space-y-3 py-1 sm:py-2">

            {!hasTerms ? (

              <div className="flex items-center min-h-[3rem] text-[#9CA3AF] dark:text-gray-500 text-xs leading-4 font-medium">

                No terms yet

              </div>

            ) : (

              terms.map((term, index) => {
                const { preview, full, truncated } = getTermNameDisplay(term.label);
                const hasName = full.length > 0;
                const nameBase =
                  'text-[#9CA3AF] dark:text-gray-400 text-xs leading-snug font-medium truncate w-full text-left';
                const truncatedHint =
                  'underline decoration-dotted decoration-[#9CA3AF]/50 dark:decoration-gray-500/50 underline-offset-2';
                const triggerClass = [
                  nameBase,
                  truncated ? truncatedHint : '',
                  'inline-flex min-h-[1.25rem] max-w-full cursor-default border-0 bg-transparent p-0 font-[inherit] rounded-sm',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E60012]/40 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-gray-900',
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <div key={index} className="flex min-w-0 items-baseline gap-2">
                    <div className="min-w-0 flex-1">
                      {hasName ? (
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <button type="button" className={triggerClass} aria-label={full}>
                              {preview}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" align="start" collisionPadding={12}>
                            {full}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <div className={nameBase}>{preview}</div>
                      )}
                    </div>
                    <div className="shrink-0 text-base font-bold tabular-nums leading-none text-[#14B8A6] dark:text-teal-400 sm:text-lg">
                      {term.plans}
                    </div>
                  </div>
                );
              })

            )}

          </div>

          <div className="w-full sm:w-auto sm:shrink-0 sm:self-stretch bg-gradient-to-br from-amber-50/80 dark:from-amber-900/20 via-amber-50/60 dark:via-amber-900/15 to-amber-100/60 dark:to-amber-900/20 flex flex-col justify-center px-3 sm:px-4 py-3.5 sm:py-4 rounded-xl border border-amber-100/50 dark:border-amber-800/30 shadow-sm min-w-0 sm:min-w-[11rem]">

            <div className="grid grid-cols-[auto_auto] gap-x-3 gap-y-2.5 items-center text-xs sm:text-sm">

              <div className="text-[#9CA3AF] dark:text-gray-400 font-medium whitespace-nowrap">Support:</div>
              <div className="text-[#1F2937] dark:text-gray-200 text-sm sm:text-base font-bold tabular-nums text-right whitespace-nowrap">
                {formatDealerCardMoney(support, isAdmin)}
              </div>

              <div className="text-[#9CA3AF] dark:text-gray-400 font-medium whitespace-nowrap">Actual:</div>
              <div className="text-[#1F2937] dark:text-gray-200 text-sm sm:text-base font-bold tabular-nums text-right whitespace-nowrap">
                {formatDealerCardMoney(expense, isAdmin)}
              </div>

              <div className="text-[#9CA3AF] dark:text-gray-400 font-medium whitespace-nowrap">Estimated:</div>
              <div className="text-[#1F2937] dark:text-gray-200 text-sm sm:text-base font-bold tabular-nums text-right whitespace-nowrap">
                {formatDealerCardMoney(estimatedCost, isAdmin)}
              </div>
            </div>

            <div className="mt-2.5 pt-2.5 border-t border-amber-200/60 dark:border-amber-800/40 grid grid-cols-[auto_auto] gap-x-3 items-baseline">
              <div className="text-[#9CA3AF] dark:text-gray-400 text-xs sm:text-sm font-bold whitespace-nowrap">Total Cost:</div>
              <div className="text-[#F97316] dark:text-orange-400 text-base sm:text-lg font-bold tabular-nums text-right whitespace-nowrap">
                {formatDealerCardMoney(totalCost, isAdmin)}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>

  );

};

