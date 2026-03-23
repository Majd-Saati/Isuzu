import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

export function TooltipProvider({ children, delayDuration = 100, ...props }) {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration} skipDelayDuration={150} {...props}>
      {children}
    </TooltipPrimitive.Provider>
  );
}

export const Tooltip = TooltipPrimitive.Root;

export const TooltipTrigger = TooltipPrimitive.Trigger;

export const TooltipContent = React.forwardRef(
  ({ className, sideOffset = 6, children, ...props }, ref) => (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          'z-[11000] max-w-[min(20rem,calc(100vw-1.5rem))] rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium leading-snug text-gray-900 shadow-lg',
          'dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100',
          'will-change-transform',
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="fill-white dark:fill-gray-800" width={10} height={5} />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
