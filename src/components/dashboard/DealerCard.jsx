import React from 'react';



export const DealerCard = ({

  name,

  avatar,

  flag,

  terms = [],

  support = 0,

  expense = 0,

  estimatedCost = 0,

  invoiceTotal = 0,

  totalCost = 0,

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



        <div className="flex w-full items-stretch gap-4 sm:gap-5 font-normal">

          <div className="flex-1 space-y-3 py-2">

            {!hasTerms ? (

              <div className="h-full flex items-center text-[#9CA3AF] dark:text-gray-500 text-xs leading-4 font-medium">

                No terms yet

              </div>

            ) : (

              terms.map((term, index) => (

                <div

                  key={index}

                  className="flex items-center justify-between gap-2"

                >

                  <div className="text-[#9CA3AF] dark:text-gray-400 text-xs leading-4 font-medium whitespace-nowrap">

                    {term.label}

                  </div>

                  <div className="text-[#14B8A6] dark:text-teal-400 text-lg leading-4 font-bold">

                    {term.plans}

                  </div>

                </div>

              ))

            )}

          </div>



          <div className="bg-gradient-to-br from-amber-50/80 dark:from-amber-900/20 via-amber-50/60 dark:via-amber-900/15 to-amber-100/60 dark:to-amber-900/20 flex flex-col items-stretch justify-center flex-1 px-4 py-4 rounded-xl border border-amber-100/50 dark:border-amber-800/30 shadow-sm">

            <div className="space-y-3">

              <div className="flex items-center justify-between gap-2">

                <div className="text-[#9CA3AF] dark:text-gray-400 text-xs leading-4 font-medium whitespace-nowrap">Support:</div>

                <div className="text-[#1F2937] dark:text-gray-200 text-base leading-4 font-bold">

                  {Number(support).toLocaleString()}

                </div>

              </div>

              <div className="flex items-center justify-between gap-2">

                <div className="text-[#9CA3AF] dark:text-gray-400 text-xs leading-4 font-medium whitespace-nowrap">Actual:</div>

                <div className="text-[#1F2937] dark:text-gray-200 text-base leading-4 font-bold">

                  {Number(expense).toLocaleString()}

                </div>

              </div>

              <div className="flex items-center justify-between gap-2">

                <div className="text-[#9CA3AF] dark:text-gray-400 text-xs leading-4 font-medium whitespace-nowrap">Estimated:</div>

                <div className="text-[#1F2937] dark:text-gray-200 text-base leading-4 font-bold">

                  {Number(estimatedCost).toLocaleString()}

                </div>

              </div>

              <div className="flex items-center justify-between gap-2">

                <div className="text-[#9CA3AF] dark:text-gray-400 text-xs leading-4 font-medium whitespace-nowrap">Invoice:</div>

                <div className="text-[#1F2937] dark:text-gray-200 text-base leading-4 font-bold">

                  {Number(invoiceTotal).toLocaleString()}

                </div>

              </div>

              <div className="h-px bg-amber-200/60 dark:bg-amber-800/30"></div>

              <div className="flex items-center justify-between gap-2 pt-1">

                <div className="text-[#9CA3AF] dark:text-gray-400 text-xs leading-4 font-bold whitespace-nowrap">Total Cost:</div>

                <div className="text-[#F97316] dark:text-orange-400 text-lg leading-4 font-bold">

                  {Number(totalCost).toLocaleString()}

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

};

