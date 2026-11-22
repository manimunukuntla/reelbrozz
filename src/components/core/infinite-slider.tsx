import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface InfiniteSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  gap?: number;
  duration?: number;
  speedOnHover?: number;
  direction?: 'horizontal' | 'vertical';
  reverse?: boolean;
}

export function InfiniteSlider({
  children,
  gap = 20,
  duration = 35,
  speedOnHover,
  direction = 'horizontal',
  reverse = false,
  className,
  ...props
}: InfiniteSliderProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate effective animation duration in seconds
  const currentDuration = isHovered && speedOnHover !== undefined ? speedOnHover : duration;

  return (
    <div
      className={cn('relative w-full overflow-hidden select-none', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <div
        className={cn(
          'flex w-max shrink-0',
          direction === 'vertical' ? 'flex-col' : 'flex-row'
        )}
        style={{
          gap: `${gap}px`,
          animation: `infinite-slide-${direction} ${currentDuration}s linear infinite ${
            reverse ? 'reverse' : 'normal'
          }`,
        }}
      >
        {/* First track */}
        <div
          className={cn(
            'flex shrink-0 items-center',
            direction === 'vertical' ? 'flex-col' : 'flex-row'
          )}
          style={{ gap: `${gap}px` }}
        >
          {children}
        </div>

        {/* Duplicate track for seamless infinite loop */}
        <div
          aria-hidden="true"
          className={cn(
            'flex shrink-0 items-center',
            direction === 'vertical' ? 'flex-col' : 'flex-row'
          )}
          style={{ gap: `${gap}px` }}
        >
          {children}
        </div>

        {/* Third track to guarantee full coverage on ultra-wide screens */}
        <div
          aria-hidden="true"
          className={cn(
            'flex shrink-0 items-center',
            direction === 'vertical' ? 'flex-col' : 'flex-row'
          )}
          style={{ gap: `${gap}px` }}
        >
          {children}
        </div>
      </div>

      <style>{`
        @keyframes infinite-slide-horizontal {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-100% / 3));
          }
        }
        @keyframes infinite-slide-vertical {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(calc(-100% / 3));
          }
        }
      `}</style>
    </div>
  );
}

export default InfiniteSlider;
